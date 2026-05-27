import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DB_NAME", "neochat")

# Connect using certifi's verified root certificates and allow invalid certificates to bypass local proxy interception
client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True)
db = client[DATABASE_NAME]


chats_collection = db["chats"]
users_collection = db["users"]
verification_collection = db["verification"]

async def save_chat_message(session_id: str, role: str, content: str, username: str = None):
    await chats_collection.insert_one({
        "session_id": session_id,
        "role": role,
        "content": content,
        "username": username
    })

async def get_chat_history(session_id: str):
    cursor = chats_collection.find({"session_id": session_id}).sort("_id", 1)
    return await cursor.to_list(length=100)

async def create_user(username: str, email: str, password_hash: str):
    await users_collection.insert_one({
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "is_verified": False
    })

async def get_user_by_username(username: str):
    return await users_collection.find_one({"username": username})

async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

async def verify_user_email(username: str):
    await users_collection.update_one(
        {"username": username},
        {"$set": {"is_verified": True}}
    )

async def save_verification_code(username: str, code: str):
    await verification_collection.update_one(
        {"username": username},
        {"$set": {"code": code}},
        upsert=True
    )

async def get_verification_code(username: str):
    doc = await verification_collection.find_one({"username": username})
    return doc["code"] if doc else None

async def delete_verification_code(username: str):
    await verification_collection.delete_one({"username": username})

async def get_user_sessions(username: str):
    pipeline = [
        {"$match": {"username": username}},
        {"$sort": {"_id": 1}},
        {"$group": {
            "_id": "$session_id",
            "first_message": {"$first": "$content"},
            "first_role": {"$first": "$role"},
            "timestamp": {"$first": "$_id"}
        }},
        {"$sort": {"timestamp": -1}}
    ]
    cursor = chats_collection.aggregate(pipeline)
    sessions = await cursor.to_list(length=100)
    
    result = []
    for s in sessions:
        # Get the first message text as the title
        title = s.get("first_message", "Chat Session")
        # clean title
        if len(title) > 30:
            title = title[:30] + "..."
        result.append({
            "session_id": s["_id"],
            "title": title
        })
    return result

