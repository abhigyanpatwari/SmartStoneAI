from utils.milestone import MilestonePlanning
from utils.history import Histories, History

import time
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
import os
import gradio as gr
import pandas as pd
from dotenv import load_dotenv

load_dotenv(".env")

model_4o = AzureChatOpenAI(
    openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
    azure_deployment=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
)

model_35 = AzureChatOpenAI(
    openai_api_version=os.environ["AZURE_OPENAI_API_VERSION1"],
    azure_deployment=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT_NAME1"],
    api_key=os.environ["AZURE_OPENAI_API_KEY1"],
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT1"],
)

embeddings = AzureOpenAIEmbeddings(
    openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
    azure_deployment=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"],
    model="text-embedding-ada-002"
)

embedding_model = embeddings.embed_query

hms = Histories("history.db")

def gradio_fn(user_id, project_description, modifying_prompt=None, total_weeks=6, evaluate=False, model_name="GPT 4o"):
    global hms
    score = -1
    start = time.time()
    if model_name == "GPT 4o":
        model = model_4o
    else:
        model = model_35

    if(modifying_prompt==None or modifying_prompt==""):
        pdt = MilestonePlanning("", project_description, model=model, embedding_model=embedding_model)
        lm = pdt.extract_milestones()
        if(evaluate):
            score = pdt.evaluate_milestones(with_summary=True)

        df = lm.dataframe(total_weeks)
        last_op = History(pdt._textify_milestones(), user_id, project_description)
        hms.insert_history(last_op)
        elapsed_time = time.time() - start
    else:
        pdt = MilestonePlanning("", project_description, model=model, embedding_model=embedding_model)
        last_op_txt = hms.get_history(user_id, project_description)
        lm = pdt.extract_milestones(modifying_prompt=modifying_prompt, model_last_output=last_op_txt)
        if(evaluate):
            score = pdt.evaluate_milestones(with_summary=True)

        df = lm.dataframe(total_weeks)
        last_op = History(pdt._textify_milestones(), user_id, project_description)
        hms.insert_history(last_op)
        elapsed_time = round(time.time() - start, 2)
    
    cb = pdt.callbacks
    
    return score, elapsed_time, df, str(lm), str(cb)

if __name__ == "__main__":
    gradio_inputs = [
        gr.Number(label="User ID"),
        gr.TextArea(label="Project Description"),
        gr.Textbox(label="Modifying Prompt"),
        gr.Slider(label="Total Weeks", value=8, minimum=4, maximum=16),
        gr.Checkbox(label="Evaluate", value=False),
        gr.Dropdown(label="Model", choices=["GPT 4o", "GPT 3.5 Turbo"], value="GPT 4o")
    ]

    gradio_outputs = [
        gr.Number(label="Average Cosine Similarity"),
        gr.Number(label="Generation Time (in s)"),
        gr.Dataframe(label="Generated Milestones", value=pd.DataFrame(columns=["title", "descriptions", "time%", "roles"])),
        gr.TextArea(label="Raw Milestones"),
        gr.Textbox(label="Callbacks")
    ]

    demo = gr.Interface(fn=gradio_fn, inputs=gradio_inputs, outputs=gradio_outputs, title="Milestonez :)")
    demo.launch(share=True, debug=True)