from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
import os
import pandas as pd
from langchain_community.callbacks import get_openai_callback
from langchain_community.utils.math import cosine_similarity
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List
import math
from dotenv import load_dotenv

load_dotenv(".env")

people_roles = ['ML Developer', 'NLP Developer', 'Computer Vision Developer', 'Frontend Developer', 'Backend Developer',
                'Product', 'IOT', 'Finance', 'Design']


class PeopleRole(BaseModel):
    roles: str = Field(description=f"One of {', '.join(people_roles)}")


class Milestone(BaseModel):
    index: int = Field(description="Milestone number")
    title: str = Field(description="Title of Project Milestone")
    description: str = Field(
        description="Detailed and Meaningful Description of Milestone, exact details of what to do in this step of the process (include names of packages)")
    time: int = Field(description="Number of weeks required for this milestone")
    roles: List[PeopleRole] = Field(description="What team member roles might be relevant for this")
    deliverables: List[str] = Field(description="List of deliverables for this milestone")


class ListOfMilestones(BaseModel):
    milestones: List[Milestone] = Field(description="Milestone details this project can be divided in (keep <=6)")

    def dataframe(self, total_weeks):
        # Ensure the number of milestones does not exceed the total weeks
        num_milestones = min(len(self.milestones), total_weeks)
        selected_milestones = self.milestones[:num_milestones]

        # Distribute the time proportionally
        time = [1] * num_milestones  # Start with 1 week per milestone
        remaining_weeks = total_weeks - num_milestones

        # If any weeks are left, distribute them proportionally
        for i in range(remaining_weeks):
            time[i % num_milestones] += 1

        df = pd.DataFrame({
            "title": [ms.title for ms in selected_milestones],
            "descriptions": [ms.description for ms in selected_milestones],
            "time": time,
            "roles": [ms.roles for ms in selected_milestones],
            "deliverables": [ms.deliverables for ms in selected_milestones]
        })
        return df


embeddings = AzureOpenAIEmbeddings(
    openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
    azure_deployment=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"],
)

our_embedding_model = embeddings.embed_query


class MilestonePlanning:
    def __init__(self, detailed, summarized, total_weeks, model=None, embedding_model=None):
        self.list_of_milestones = None
        self.detailed_description = detailed
        self.summarized_description = summarized
        self.total_weeks = total_weeks  # Added this line to keep track of total weeks

        # Ensure the model is correctly set
        if model is None:
            self.model = AzureChatOpenAI(
                openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
                azure_deployment=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"],
                max_retries=2,
            )
        else:
            self.model = model

        # Ensure the embedding model is correctly set
        if embedding_model is None:
            self.embedding_model = our_embedding_model
        else:
            self.embedding_model = embedding_model

    def extract_milestones(self, modifying_prompt=None, model_last_output=None, json=False):
        try:
            with get_openai_callback() as cb:
                if modifying_prompt is None:
                    # Adapt the prompt to limit the number of milestones based on total_weeks
                    self.list_of_milestones = self.model.with_structured_output(
                        ListOfMilestones, method='function_calling'
                    ).invoke(
                        f"""\
                            Generate up to {min(6, self.total_weeks)} technical milestones for the following project, including details like the job roles required, time to complete, and key deliverables for each milestone. 

                            Detailed Description:
                            {self.detailed_description}

                            Summarized Description:
                            {self.summarized_description}
                            """
                    )
                else:
                    self.list_of_milestones = self.model.with_structured_output(
                        ListOfMilestones, method='function_calling'
                    ).invoke(
                        f"""\
                            Previous Output:
                            {model_last_output}

                            Modify the technical milestones for the project according to this query:
                            {modifying_prompt}
                            """
                    )

                self.callbacks = cb
        except Exception as e:
            return e

        return self.list_of_milestones

    def _textify_milestones(self):
        if not self.list_of_milestones.milestones:
            raise Exception("extract_milestones() not called before textify!")

        text = ""
        for milestone in self.list_of_milestones.milestones:
            text += self._textify_milestone_one(milestone)

        return text

    def _textify_milestone_one(self, milestone):
        assert type(milestone) == Milestone, f"Milestone type inconsistent with what was expected. Received {type(milestone)}"
        text = f"""{milestone.index}. {milestone.title} | Duration: {milestone.time}
            {milestone.description}
            Deliverables: {', '.join(milestone.deliverables)}
            """
        return text

    def evaluate_milestones(self, with_summary=False):
        milestones_text = self._textify_milestones()

        milestone_embedding = self.embedding_model(milestones_text)

        if not with_summary:
            description_embedding = self.embedding_model(self.detailed_description)
        else:
            description_embedding = self.embedding_model(self.summarized_description)

        self.similarity = cosine_similarity(milestone_embedding, description_embedding).item()

        return self.similarity


if __name__ == "__main__":
    pass
