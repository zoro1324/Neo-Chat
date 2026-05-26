import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DB_NAME", "neochat")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
chats_collection = db["chats"]

async def save_chat_message(session_id: str, role: str, content: str):
    await chats_collection.insert_one({
        "session_id": session_id,
        "role": role,
        "content": content
    })

async def get_chat_history(session_id: str):
    cursor = chats_collection.find({"session_id": session_id}).sort("_id", 1)
    return await cursor.to_list(length=100)

