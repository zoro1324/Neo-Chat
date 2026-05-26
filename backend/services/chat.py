from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os

from .tools.custom_search import custom_image_search

load_dotenv()

# Initialize the LLM with NVIDIA NIM API
llm = ChatOpenAI(
    model="meta/llama-3.1-70b-instruct",
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY"),
    temperature=0.3
)

# Define the tools available to the agent
tools = [custom_image_search]

# Define the system prompt constraint for the agent
SYSTEM_PROMPT = (
    "You are an educational agentic chatbot designed to help students. "
    "When a student asks a question that requires an image reference (like an architecture diagram or scientific illustration), "
    "you MUST use the custom_image_search tool to find reference images. "
    "Provide clear and concise educational text content explaining the topic. "
    "CRITICAL: You MUST embed the images returned by the tool directly into your response using valid Markdown image syntax: ![description](image_url). "
    "Do not just list the raw URLs in plain text. "
    "Always answer in a friendly, encouraging, and educational tone."
)

# Create the tool calling agent using LangGraph
agent = create_react_agent(llm, tools, prompt=SYSTEM_PROMPT)

async def process_chat_message(message: str, chat_history: list = []) -> str:
    """Processes a user message using the agentic chatbot."""
    if not chat_history:
        chat_history = []
        
    messages = chat_history + [HumanMessage(content=message)]
        
    response = await agent.ainvoke({"messages": messages})
    
    return response["messages"][-1].content

