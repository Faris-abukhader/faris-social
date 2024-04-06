import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

# Load the minimized dataset
df = pd.read_csv('minimized_dataset.csv')  # Adjust the file path as needed


# Fill missing values in the 'text' column with an empty string
df['text'] = df['text'].fillna('')

# Remove rows where 'text' is an empty string
df = df[df['text'] != '']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    df['text'], df['is_toxic'], test_size=0.2, random_state=42
)

# Create a bag-of-words representation of the text data
vectorizer = CountVectorizer()
X_train_bow = vectorizer.fit_transform(X_train)
X_test_bow = vectorizer.transform(X_test)

# Train a Multinomial Naive Bayes classifier for toxicity detection
classifier = MultinomialNB()
classifier.fit(X_train_bow, y_train)

# Evaluate the model on the test set for toxicity detection
accuracy = classifier.score(X_test_bow, y_test)
print(f"Accuracy for Toxicity Detection: {accuracy:.2f}")

# Save the trained model and vectorizer
pickle.dump(classifier, open('toxicity_detection_model.pkl', 'wb'))
pickle.dump(vectorizer, open('toxicity_vectorizer.pkl', 'wb'))
