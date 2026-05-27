import os
import logging
import shutil
import hashlib
import random
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from services.chat import process_chat_message
from services.rag import process_document, UPLOAD_DIR
from database import (
    save_chat_message, 
    get_chat_history,
    create_user,
    get_user_by_username,
    get_user_by_email,
    verify_user_email,
    save_verification_code,
    get_verification_code,
    delete_verification_code,
    get_user_sessions
)
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

def hash_password(password: str) -> str:
    salt = "neochat_secure_salt_2026"
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

class MessageRequest(BaseModel):
    session_id: str
    message: str
    username: str = None

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class VerifyRequest(BaseModel):
    username: str
    code: str

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/")
async def root():
    return {"message": "Welcome to the Neo-Chat API"}

@app.post("/register")
async def register(data: RegisterRequest):
    existing_user = await get_user_by_username(data.username)
    if existing_user:
        return {"success": False, "message": "Username already taken."}
    
    existing_email = await get_user_by_email(data.email)
    if existing_email:
        return {"success": False, "message": "Email already registered."}
        
    password_hash = hash_password(data.password)
    await create_user(data.username, data.email, password_hash)
    
    # Generate 6-digit code
    code = f"{random.randint(100000, 999999)}"
    await save_verification_code(data.username, code)
    
    print(f"\n=============================================")
    print(f"EMAIL VERIFICATION CODE FOR {data.username} ({data.email}):")
    print(f" ---> {code} <--- ")
    print(f"=============================================\n")
    logger.info(f"Generated verification code {code} for user {data.username}")
    
    return {"success": True, "message": "Registration successful. Please verify your email.", "code": code}

@app.post("/verify-email")
async def verify_email(data: VerifyRequest):
    stored_code = await get_verification_code(data.username)
    if not stored_code or stored_code != data.code:
        return {"success": False, "message": "Invalid or expired verification code."}
    
    await verify_user_email(data.username)
    await delete_verification_code(data.username)
    return {"success": True, "message": "Email verified successfully. You can now log in."}

@app.post("/login")
async def login(data: LoginRequest):
    user = await get_user_by_username(data.username)
    if not user:
        return {"success": False, "message": "Invalid username or password."}
    
    if not user.get("is_verified", False):
        return {"success": False, "message": "Please verify your email before logging in.", "unverified": True}
        
    password_hash = hash_password(data.password)
    if user["password_hash"] != password_hash:
        return {"success": False, "message": "Invalid username or password."}
        
    return {"success": True, "username": user["username"], "email": user["email"]}

@app.get("/sessions/{username}")
async def fetch_user_sessions(username: str):
    sessions = await get_user_sessions(username)
    return sessions

@app.get("/history/{session_id}")
async def fetch_history(session_id: str):
    history = await get_chat_history(session_id)
    return [{"id": str(msg["_id"]), "role": msg["role"], "content": msg["content"]} for msg in history]

@app.post("/send")
async def send_message(data: MessageRequest):
    logger.info("Received request for session %s from user %s", data.session_id, data.username)

    history_docs = await get_chat_history(data.session_id)
    chat_history_llm = []
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
    await save_chat_message(data.session_id, "user", data.message, data.username)
    await save_chat_message(data.session_id, "assistant", reply, data.username)

    return {"reply": reply}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    num_chunks = process_document(file_path)
    return {"message": f"Successfully processed {file.filename} into {num_chunks} chunks."}

