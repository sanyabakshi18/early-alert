
import pandas as pd
import os

# Column names of the UCI Heart Disease dataset
columns = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal",
    "num"
]

RAW_PATH = "data/raw/processed.cleveland.data"
OUTPUT_PATH = "data/processed/heart_disease_cleaned.csv"


def load_dataset():

    # Load dataset and recognize ? as missing values
    df = pd.read_csv(
        RAW_PATH,
        names=columns,
        na_values="?"
    )

    print("Original dataset shape:", df.shape)

    # Check missing values
    print("\nMissing values:")
    print(df.isnull().sum())

    # Convert target into binary classification
    # 0 = No disease indicated
    # 1 = Disease indicated
    df["target"] = (df["num"] > 0).astype(int)

    # Remove original target column
    df.drop(columns=["num"], inplace=True)

    # Create output folder
    os.makedirs("data/processed", exist_ok=True)

    # Save cleaned dataset
    df.to_csv(OUTPUT_PATH, index=False)

    print("\nCleaned dataset shape:", df.shape)

    print("\nTarget distribution:")
    print(df["target"].value_counts())

    print("\nDataset saved successfully!")

    return df


if __name__ == "__main__":
    load_dataset()
