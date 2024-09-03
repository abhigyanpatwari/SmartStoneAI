import sqlite3

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field, ValidationError
from typing import Optional, List
from utils.history import Histories, History  # Import the SQLite-based setup
import time
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
import os
from langchain_community.callbacks import get_openai_callback
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from utils.milestone import MilestonePlanning

# Load environment variables from .env file
load_dotenv(".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models and embeddings with proper error handling
try:
    model_4o = AzureChatOpenAI(
        openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
        azure_deployment=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"],
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    )

    embeddings = AzureOpenAIEmbeddings(
        openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
        azure_deployment=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"],
        model="text-embedding-ada-002"
    )
except KeyError as e:
    raise RuntimeError(f"Environment variable {e.args[0]} not set.") from e
except Exception as e:
    raise RuntimeError(f"Failed to initialize Azure OpenAI services: {str(e)}") from e

embedding_model = embeddings.embed_query

# Initialize the Histories object for database operations using SQLite
hms = Histories()


class HistoryModel(BaseModel):
    id: str
    user_id: str
    project_id: str
    history: str


# Path to SQLite database
DB_PATH = 'history.db'


class RequestData(BaseModel):
    user_id: int = Field(..., description="Unique identifier for the user")
    project_description: str = Field(...,
                                     description="Description of the project for which milestones are to be generated")
    modifying_prompt: Optional[str] = Field(None, description="Prompt for modifying the milestones")
    total_weeks: int = Field(6, description="Total number of weeks for the milestones", ge=3, le=16)
    evaluate: bool = Field(False, description="Whether to evaluate the milestones or not")
    model: str = Field("GPT 4o", description="The model to use for milestone generation")


class MilestoneModel(BaseModel):
    index: int
    title: str
    description: str
    roles: List[str]
    deliverables: List[str]
    time: int
    user_id: str
    project_id: str


@app.post("/generate_milestones/")
def generate_milestones(request: RequestData):
    global hms
    score = -1
    start = time.time()

    model = model_4o

    try:
        # Generate the summarized description using the model
        summarized_description = model.invoke(
            f"Summarize the following project description: {request.project_description}")

        if not request.modifying_prompt:
            pdt = MilestonePlanning(
                detailed=request.project_description,
                summarized=summarized_description,
                total_weeks=request.total_weeks,  # Pass the total weeks here
                model=model,
                embedding_model=embedding_model
            )
            lm = pdt.extract_milestones()
            if request.evaluate:
                score = pdt.evaluate_milestones(with_summary=True)

            df = lm.dataframe(request.total_weeks)
            last_op = History(pdt._textify_milestones(), request.user_id, request.project_description)
            hms.insert_history(last_op)
            elapsed_time = time.time() - start
        else:
            last_op_txt = hms.get_history(str(request.user_id), request.project_description)
            pdt = MilestonePlanning(
                detailed=request.project_description,
                summarized=summarized_description,
                total_weeks=request.total_weeks,  # Pass the total weeks here
                model=model,
                embedding_model=embedding_model
            )
            lm = pdt.extract_milestones(modifying_prompt=request.modifying_prompt,
                                        model_last_output=last_op_txt if last_op_txt else None)
            if request.evaluate:
                score = pdt.evaluate_milestones(with_summary=True)

            df = lm.dataframe(request.total_weeks)
            last_op = History(pdt._textify_milestones(), request.user_id, request.project_description)
            hms.insert_history(last_op)
            elapsed_time = round(time.time() - start, 2)

        cb = pdt.callbacks

        return {
            "average_cosine_similarity": score,
            "generation_time": elapsed_time,
            "generated_milestones": df.to_dict(orient="records"),
            "raw_milestones": str(lm),
            "callbacks": str(cb)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the request: {str(e)}")


@app.post("/update_milestone/")
def update_milestone(milestone: MilestoneModel):
    try:
        # Get the existing history for the project and user
        existing_history = hms.get_history(milestone.user_id, milestone.project_id)
        if not existing_history:
            raise HTTPException(status_code=404, detail="History not found for the specified user and project.")

        # Update the specific milestone within the history
        updated_history = hms.update_specific_milestone(existing_history, milestone.dict())

        # Save the updated history back to the database
        milestone_obj = History(updated_history, milestone.user_id, milestone.project_id)
        hms.update_history(milestone_obj)

        return {"status": "success", "message": "Milestone updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while updating the milestone: {str(e)}")


@app.get("/get_all_histories/", response_model=List[HistoryModel])
def get_all_histories():
    """
    Fetches all histories from the SQLite database.
    """
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()

        # Execute the query to retrieve all rows from the history table
        c.execute('SELECT id, user_id, project_id, history FROM history')
        rows = c.fetchall()

        # Close the database connection
        conn.close()

        # Map the rows to the HistoryModel Pydantic model
        histories = [HistoryModel(id=row[0], user_id=row[1], project_id=row[2], history=row[3]) for row in rows]

        return histories

    except Exception as e:
        # If there's an error, return an HTTP 500 error
        raise HTTPException(status_code=500, detail=f"An error occurred while retrieving histories: {str(e)}")


@app.get("/health_check/")
def health_check():
    """
    Returns a simple "Ok" response to confirm the API is up and running.
    """
    return {"status": "Ok"}


@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
