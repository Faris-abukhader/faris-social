from fastapi import FastAPI
from pydantic import BaseModel
import pickle
from imageFiltering import image_toxic_detector
# uvicorn app:app --reload
app = FastAPI()

# Load the saved model using pickle
language_detector = pickle.load(open('language_detection','rb'))
vectorizer = pickle.load(open('language_detection_vectorizer','rb'))
toxicity_detector = pickle.load(open('toxicity_detection_full','rb'))
toxicity_vectorizer = pickle.load(open('toxicity_vectorizer_full','rb'))
spam_detector = pickle.load(open('spam_detection','rb'))
spam_vectorizer = pickle.load(open('spam_vectorizer','rb'))


class TextRequest(BaseModel):
    text: str

class ImageRequest(BaseModel):
    image: str

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/detect_language")
def detect_language(request: TextRequest):
    text = request.text
    text = [text]

    print(text)

    # Make predictions using the loaded classifier
    text_sample = vectorizer.transform(text)
    prediction = language_detector.predict(text_sample)[0]

    return {"predicted_language": prediction}


@app.post("/detect_toxicity")
def detect_language(request: TextRequest):
    text = request.text
    text = [text]

    vector = toxicity_vectorizer.transform(text)
    predict = toxicity_detector.predict(vector)
    print(predict[0])
    result = False
    if predict[0] == 1:
        result = True
    else:
        result = False

    return {"is_toxic":result}


@app.post("/detect_spam")
def detect_spam(request: TextRequest):
    text = request.text
    text = [text]

    vector = spam_vectorizer.transform(text)
    predict = spam_detector.predict(vector)
    print(predict[0])
    result = False
    if predict[0] == 'spam':
        result = True
    else:
        result = False

    return {"is_spam":result}


@app.post("/is-image-toxic")
def detect_spam(request: ImageRequest):
    image = request.image

    return image_toxic_detector(image)