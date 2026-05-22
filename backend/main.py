import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
logger = logging.getLogger("neo_chat.backend")

FRONTEND_URL = os.getenv("FRONTEND_URL")

if not FRONTEND_URL:
    logger.warning("FRONTEND_URL is not set; CORS will not allow any frontend origin.")
else:
    logger.info("CORS is configured for frontend origin: %s", FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.post("/send")
async def send_message(data: Message):
    logger.info("Received /send request with message length %s", len(data.message))

    reply = f"The message '{data.message}' was received by the server"

    logger.debug("Reply payload generated: %s", reply)

    return {
        "reply": reply,
    }