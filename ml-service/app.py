from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from pathlib import Path

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent

model = joblib.load(BASE_DIR / "models" / "cardio_model.pkl")
model_info = joblib.load(BASE_DIR / "models" / "model_info.pkl")
FEATURES = model_info["features"]

# The endpoint searches these common project locations for the cleaned CSV.
DATASET_CANDIDATES = [
    BASE_DIR / "data" / "processed" / "heart_disease_cleaned.csv",
    BASE_DIR.parent / "data" / "processed" / "heart_disease_cleaned.csv",
    BASE_DIR.parent.parent / "data" / "processed" / "heart_disease_cleaned.csv",
]

def get_dataset_path():
    for path in DATASET_CANDIDATES:
        if path.exists():
            return path
    searched = ", ".join(str(path) for path in DATASET_CANDIDATES)
    raise FileNotFoundError(
        "Could not find heart_disease_cleaned.csv. Checked: " + searched
    )

def run_model(input_data):
    prediction = int(model.predict(input_data)[0])
    probabilities = model.predict_proba(input_data)[0]

    return {
        "success": True,
        "model": model_info.get("model_name", "Trained cardiovascular model"),
        "predicted_class": prediction,
        "class_probabilities": {
            str(cls): round(float(prob), 4)
            for cls, prob in zip(model.classes_, probabilities)
        },
    }

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Cardio ML API is running!"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model": model_info.get("model_name", "Trained cardiovascular model")
    })

# Kept for any existing workflow that sends all 13 model features.
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not isinstance(data, dict):
            return jsonify({"error": "JSON object required"}), 400

        missing = [feature for feature in FEATURES if feature not in data]
        if missing:
            return jsonify({
                "error": "Missing required features",
                "missing_features": missing
            }), 400

        input_data = pd.DataFrame(
            [[data[feature] for feature in FEATURES]],
            columns=FEATURES
        ).apply(pd.to_numeric, errors="raise")

        if input_data.isnull().any().any():
            return jsonify({"error": "All features must have valid values"}), 400

        return jsonify(run_model(input_data))

    except (ValueError, TypeError):
        return jsonify({"error": "Invalid feature values"}), 400
    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify({"error": "Internal prediction error"}), 500

# New endpoint: selects one actual, complete record from the cleaned dataset.
# The record is used only to demonstrate the trained model, not to assess
# the person completing the symptom questionnaire.
@app.route("/demo-predict", methods=["POST"])
def demo_predict():
    try:
        dataset_path = get_dataset_path()
        dataset = pd.read_csv(dataset_path)

        missing_features = [feature for feature in FEATURES if feature not in dataset.columns]
        if missing_features:
            return jsonify({
                "error": "The cleaned CSV is missing model features",
                "missing_features": missing_features
            }), 400

        # Select the first complete record in the dataset, consistently,
        # so the demonstration is repeatable.
        complete_rows = dataset.dropna(subset=FEATURES)
        if complete_rows.empty:
            return jsonify({
                "error": "No complete dataset record is available for demonstration"
            }), 400

        sample = complete_rows.iloc[[0]]
        input_data = sample[FEATURES].apply(pd.to_numeric, errors="raise")

        result = run_model(input_data)
        result["dataset_source"] = dataset_path.name

        # Include the dataset's known target label as a reference, if present.
        # This is not used as an input to the model.
        if "target" in sample.columns and pd.notna(sample.iloc[0]["target"]):
            result["dataset_reference_target"] = int(sample.iloc[0]["target"])

        result["demonstration_only"] = True
        return jsonify(result)

    except FileNotFoundError as error:
        return jsonify({"error": str(error)}), 500
    except (ValueError, TypeError):
        return jsonify({"error": "Dataset contains invalid feature values"}), 400
    except Exception:
        app.logger.exception("Dataset demonstration failed")
        return jsonify({"error": "Dataset demonstration failed"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
