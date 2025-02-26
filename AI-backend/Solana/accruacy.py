import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pickle
import pandas as pd
from io import BytesIO
import base64
import seaborn as sns
from tensorflow.keras.models import load_model
from sklearn.metrics import mean_absolute_error, mean_squared_error
# from sklearn.preprocessing import MinMaxScaler

# Load dataset and other assets
data = pd.read_csv("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Solana\\historical_prices.csv", skiprows=3, header=None, names=["Date", "price"])
data['price'] = pd.to_numeric(data['price'], errors='coerce')
data = data.dropna(subset=['price'])
prices = data['price'].values.reshape(-1, 1)

# Load the trained model and scaler
model = load_model("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Solana\\model.h5")
with open("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Solana\\scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

prices_scaled = scaler.transform(prices)

def generate_prediction_plot():
    """Generates and returns a base64-encoded prediction plot image."""
    time_steps = 10
    test_X, test_y = [], []
    start = len(prices_scaled) - time_steps - 100
    end = len(prices_scaled) - time_steps
    if start < 0:
        return None  # Not enough data for plotting

    for i in range(start, end):
        test_X.append(prices_scaled[i : i + time_steps, 0])
        test_y.append(prices_scaled[i + time_steps, 0])

    test_X = np.array(test_X).reshape(-1, time_steps, 1)
    test_y = np.array(test_y).reshape(-1, 1)

    
    # Make predictions
    predictions_scaled = model.predict(test_X)
    predictions = scaler.inverse_transform(predictions_scaled)
    actual_prices = scaler.inverse_transform(test_y)

    # Compute error metrics
    mae = mean_absolute_error(actual_prices, predictions)  # Mean Absolute Error
    mse = mean_squared_error(actual_prices, predictions)  # Mean Squared Error
    rmse = np.sqrt(mse)  # Root Mean Squared Error

    # Compute accuracy percentage
    mape = np.mean(np.abs((actual_prices - predictions) / actual_prices)) * 100  # Mean Absolute Percentage Error
    accuracy = 100 - mape  # Accuracy in percentage

    predictions_scaled = model.predict(test_X)
    predictions = scaler.inverse_transform(predictions_scaled)
    actual_prices = scaler.inverse_transform(test_y)

    plt.figure(figsize=(12, 6))
    sns.set_style("whitegrid")
    plt.plot(actual_prices, label="Actual Prices", color="blue", linewidth=2)
    plt.plot(predictions, label="Predicted Prices", color="red", linestyle="dashed", linewidth=2)
    plt.xlabel("Time")
    plt.ylabel("Price")
    plt.title(f"Actual vs Predicted Prices (Last 100 Days)\nAccuracy: {accuracy:.2f}%")
    plt.legend()

    buf = BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode("utf-8")
    buf.close()

    return image_base64, {"MAE": mae, "MSE": mse, "RMSE": rmse, "Accuracy (%)": accuracy}