import os
import logging
import shutil
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from services.chat import process_chat_message
from services.rag import process_document, UPLOAD_DIR
from database import save_chat_message, get_chat_history
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()

app = FastAPI()
logger = logging.getLogger("neo_chat.backend")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    session_id: str
    message: str

@app.post("/")
async def root():
    return {"message": "Welcome to the Neo-Chat API"}

@app.get("/history/{session_id}")
async def fetch_history(session_id: str):
    history = await get_chat_history(session_id)
    # Map to frontend message format
    return [{"id": str(msg["_id"]), "role": msg["role"], "content": msg["content"]} for msg in history]

@app.post("/send")
async def send_message(data: MessageRequest):
    logger.info("Received request for session %s", data.session_id)

    # Fetch history for context (optional, passing last few messages)
    history_docs = await get_chat_history(data.session_id)
    chat_history_llm = []
    # keep last 5 messages for context
    for doc in history_docs[-5:]:
        if doc["role"] == "user":
            chat_history_llm.append(HumanMessage(content=doc["content"]))
        elif doc["role"] == "assistant":
            chat_history_llm.append(AIMessage(content=doc["content"]))

    try:
        reply = await process_chat_message(data.message, chat_history_llm)
    except Exception as e:
        logger.error("Error processing message: %s", str(e))
        reply = "I'm sorry, but I encountered an error while trying to process your request."

    # Save to MongoDB
    await save_chat_message(data.session_id, "user", data.message)
    await save_chat_message(data.session_id, "assistant", reply)

    return {"reply": reply}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    num_chunks = process_document(file_path)
    return {"message": f"Successfully processed {file.filename} into {num_chunks} chunks."}

