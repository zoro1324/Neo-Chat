#The use of this file is to create a google custom search API tool which will search for images on a given topic and return it 

from langchain.tools import tool 
import requests
import os
from duckduckgo_search import DDGS

@tool
def custom_image_search(query: str) -> list[str]:
    """Search for images on a given topic"""
    api_key = os.getenv("GOOGLE_API_KEY")
    cse_id = os.getenv("GOOGLE_CSE_ID")
    
    # Try Google Custom Search first
    if api_key and cse_id:
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
            if images:
                return images
        except Exception as e:
            print(f"Google custom search failed: {e}. Falling back to DuckDuckGo.")

    # Fallback to DuckDuckGo search if Google fails or keys are missing
    try:
        results = DDGS().images(
            keywords=query,
            region="wt-wt",
            safesearch="moderate",
            max_results=5,
        )
        images = [str(item.get("image")) for item in results if item.get("image")]
        return images if images else ["No images found."]
    except Exception as e:
        return [f"An error occurred while fetching images: {str(e)}"]