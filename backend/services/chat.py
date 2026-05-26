from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
import os

from .tools.custom_search import custom_image_search
from .rag import get_retriever

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

SYSTEM_PROMPT = (
    "You are an educational agentic chatbot designed to help students. "
    "When a student asks a question that requires an image reference "
    "(like an architecture diagram or scientific illustration), "
    "you MUST use the custom_image_search tool to find reference images. "
    "Provide clear and concise educational text content explaining the topic. "
    "CRITICAL: You MUST embed the images returned by the tool directly into your response "
    "using valid Markdown image syntax: ![description](image_url). "
    "Always answer in a friendly, encouraging, and educational tone."
)

agent = create_react_agent(llm, tools, prompt=SYSTEM_PROMPT)

async def process_chat_message(message: str, chat_history: list = []) -> str:
    """Processes a user message using the agentic chatbot."""
    if not chat_history:
        chat_history = []
    
    retriever = get_retriever()
    context_str = ""
    if retriever:
        docs = retriever.invoke(message)
        if docs:
            context_str = (
                "\n\nCRITICAL: Use the following extracted document context to answer the user's question conceptually. "
                "If the textual answer is not contained in the text, say 'I cannot answer based on the provided document.' "
                "However, you MUST STILL use your custom_image_search tool to find and embed any requested diagrams or relevant images.\n\nContext:\n"
            ) + "\n".join([doc.page_content for doc in docs])
            
    messages = chat_history.copy()
    if context_str:
        messages.append(SystemMessage(content=context_str))
        
    messages.append(HumanMessage(content=message))
        
    response = await agent.ainvoke({"messages": messages})
    
    return response["messages"][-1].content

