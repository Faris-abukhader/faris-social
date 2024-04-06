from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report
import pandas as pd
import pickle


# Define column names
column_names = ['isSpam', 'content']

# Read the dataset into a DataFrame
df = pd.read_csv('SMSSpamCollection', sep='\t', header=None, names=column_names)

# Display the DataFrame
print(df.head())



# Step 2: Feature Extraction
vectorizer = TfidfVectorizer(max_features=1000)  # You can adjust max_features as needed
X = vectorizer.fit_transform(df['content'])
y = df['isSpam']

# Step 3: Split the Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Model Training
model = MultinomialNB()
model.fit(X_train, y_train)

# Step 5: Model Evaluation
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))


pickle.dump(model, open('spam_detection', 'wb'))
pickle.dump(vectorizer, open('spam_vectorizer', 'wb'))

