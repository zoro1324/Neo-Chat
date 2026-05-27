#The use of this file is to create a google custom search API tool which will search for images on a given topic and return it 

from langchain.tools import tool 
import requests
import os
from ddgs import DDGS

@tool
def custom_image_search(query: str) -> list[str]:
    """Search for images on a given topic"""
  
    try:
        results = DDGS().images(
            query,
            region="wt-wt",
            safesearch="moderate",
            max_results=5,
        )
        images = [str(item.get("image")) for item in results if item.get("image")]
        return images if images else ["No images found."]
    
    except Exception as e:
        return [f"An error occurred while fetching images: {str(e)}"]