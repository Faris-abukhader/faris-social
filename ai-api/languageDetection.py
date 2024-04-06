import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle

# Load the CSV file into a pandas DataFrame
df = pd.read_csv('language_Detection.csv')

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    df['Text'], df['Language'], test_size=0.2, random_state=42
)

# Create a bag-of-words representation of the text data
vectorizer = CountVectorizer()
X_train_bow = vectorizer.fit_transform(X_train)
X_test_bow = vectorizer.transform(X_test)

# Train a Multinomial Naive Bayes classifier
classifier = MultinomialNB()
classifier.fit(X_train_bow, y_train)

# Make predictions on the test set
y_pred = classifier.predict(X_test_bow)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")

# Display additional evaluation metrics
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


pickle.dump(classifier,open('language_detection','wb'))
pickle.dump(vectorizer,open('language_detection_vectorizer','wb'))
