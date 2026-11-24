import requests

url = "http://127.0.0.1:5000/predict"

data = {
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
}

response = requests.post(url, json=data)

print("Status:", response.status_code)
print("Response:", response.json())