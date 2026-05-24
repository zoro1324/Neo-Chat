#The use of this file is to create a google custom search API tool which will search for images on a given topic and return it 

from langchain.tools import tool 
import requests
import os

@tool
def custom_image_search(query: str) -> list[str]:
    """Search for images on a given topic"""
    api_key = os.getenv("GOOGLE_API_KEY")
    cse_id = os.getenv("GOOGLE_CSE_ID")
    
    if not api_key or not cse_id:
        return ["Error: GOOGLE_API_KEY and GOOGLE_CSE_ID environment variables must be set."]
        
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": query,
        "cx": cse_id,
        "key": api_key,
        "searchType": "image",
        "num": 5
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        results = response.json()
        
        images = [item["link"] for item in results.get("items", [])]
        return images if images else ["No images found."]
    except Exception as e:
        return [f"An error occurred while fetching images: {str(e)}"]