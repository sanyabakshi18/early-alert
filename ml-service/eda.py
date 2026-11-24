
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Load processed dataset
DATA_PATH = "data/processed/heart_disease_cleaned.csv"

df = pd.read_csv(DATA_PATH)

# Create folder for graphs
os.makedirs("eda_results", exist_ok=True)

sns.set_theme(style="whitegrid")


# 1. Target distribution
plt.figure(figsize=(7, 5))

sns.countplot(data=df, x="target")

plt.title("Heart Disease Target Distribution")
plt.xlabel("Target (0 = No disease, 1 = Disease)")
plt.ylabel("Number of Records")

plt.savefig("eda_results/target_distribution.png")
plt.show()


# 2. Age distribution
plt.figure(figsize=(7, 5))

sns.histplot(data=df, x="age", bins=20, kde=True)

plt.title("Age Distribution")
plt.xlabel("Age")
plt.ylabel("Frequency")

plt.savefig("eda_results/age_distribution.png")
plt.show()


# 3. Correlation heatmap
plt.figure(figsize=(12, 8))

sns.heatmap(
    df.corr(numeric_only=True),
    annot=True,
    cmap="coolwarm",
    fmt=".2f"
)

plt.title("Feature Correlation Heatmap")

plt.savefig("eda_results/correlation_heatmap.png")
plt.show()


# 4. Cholesterol distribution
plt.figure(figsize=(7, 5))

sns.histplot(data=df, x="chol", bins=20, kde=True)

plt.title("Cholesterol Distribution")
plt.xlabel("Cholesterol")
plt.ylabel("Frequency")

plt.savefig("eda_results/cholesterol_distribution.png")
plt.show()


print("EDA completed!")

print("\nDataset information:")
print(df.describe())
