import joblib
import pandas as pd

model = joblib.load("models/cardio_model.pkl")

sample = pd.DataFrame([{
    "age": 55,
    "trestbps": 130,
    "chol": 240,
    "thalach": 150,
    "oldpeak": 1.5,
    "sex": 1,
    "cp": 2,
    "fbs": 0,
    "restecg": 1,
    "exang": 0,
    "slope": 1,
    "ca": 0,
    "thal": 2
}])

prediction = model.predict(sample)
probability = model.predict_proba(sample)

print("Model loaded successfully!")
print("Prediction:", prediction[0])
print("Class probabilities:", probability[0])