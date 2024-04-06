from langchain_community.llms import ollama as langOllama
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import ollama
import requests


def image_toxic_detector(image_url):

    response = requests.get(image_url)
    image =  response.content
    res = ollama.chat(
        model="llava",
        messages=[
            {
                'role': 'user',
                'content': 'Describe this image:',
                'images': [image]
            }
        ]
    )

    image_content= res['message']['content']
    
    print(image_content)

    llm = langOllama.Ollama(model='mistral:latest',format='json')

    prompt = PromptTemplate(
            template="""
            
            You are a content moderation expert.
            Determine if the user input contains 
            toxic, pornographic, sexually harassing, 
            hate speech or adult content. 
            Provide a binary score ('True' or 'False') and a reason for the score
            Provide the binary result as a JSON with a two keys 'result' and 'reason' and no premable or explaination.
            user input : {input}
            """,
            input_variables=["input"],
        )


    chain = prompt |  llm | StrOutputParser()
    return chain.invoke({'input':image_content})





