import matplotlib 
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import pickle
import pandas as pd
from tensorflow.keras.models import load_model
# from sklearn.preprocessing import MinMaxScaler
from io import BytesIO
import base64

# Load historical data (for plotting history)
data = pd.read_csv("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Bitcoin\\historical_prices.csv", skiprows=3, header=None, names=["Date", "price"])
data['Date'] = pd.to_datetime(data['Date'], errors='coerce')
data['price'] = pd.to_numeric(data['price'], errors='coerce')
data = data.dropna(subset=['Date', 'price'])

# Load the trained model and scaler
model = load_model("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Bitcoin\\model.h5")
with open("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Bitcoin\\scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Precompute normalized prices from historical data.
prices = data['price'].values.reshape(-1, 1)
prices_scaled = scaler.transform(prices)

def generate_next_5_prediction_plot(input_prices: list[float]) -> str:
    """
    Given a list of 10 input prices, this function:
    - Normalizes the input prices.
    - Uses them to predict the next 5 days iteratively.
    - Generates a plot showing the predicted prices along with the actual historical prices (last 30 days).
    - Returns the plot as a base64-encoded PNG image.

    :param input_prices: List of exactly 10 float values (last 10 days' prices)
    :return: Base64-encoded PNG image string.
    """
    if len(input_prices) != 10:
        raise ValueError("Exactly 10 prices are required as input.")

    # Normalize the provided input prices.
    last_prices = np.array(input_prices).reshape(-1, 1)
    last_prices_scaled = scaler.transform(last_prices)
    time_steps = 10
    last_10_days = last_prices_scaled.reshape(1, time_steps, 1)

    # Predict next 5 days iteratively.
    future_predictions_scaled = []
    for _ in range(5):
        next_day_scaled = model.predict(last_10_days)[0][0]  # Predict one day ahead.
        future_predictions_scaled.append(next_day_scaled)
        # Update the window: remove the oldest price and append the predicted price.
        last_10_days = np.roll(last_10_days, shift=-1, axis=1)
        last_10_days[0, -1, 0] = next_day_scaled

    # Inverse transform predictions to get original prices.
    future_predictions = scaler.inverse_transform(
        np.array(future_predictions_scaled).reshape(-1, 1)
    )

    # Create future dates: starting from tomorrow.
    start_date = pd.Timestamp.today() + pd.Timedelta(days=1)
    future_dates = pd.date_range(start=start_date, periods=5)



    # Plot actual historical prices (last 30 days) and predicted future prices.
    plt.figure(figsize=(12, 6))
    sns.set_style("whitegrid")
    hist_days = data.iloc[-30:]
    plt.plot(hist_days["Date"], hist_days["price"], label="Actual Prices (Last 30 Days)", color="blue", linewidth=2)
    plt.plot(future_dates, future_predictions, label="Predicted Prices (Next 5 Days)", color="red", linestyle="dashed", linewidth=2)
    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.title("Predicted Prices for the Next 5 Days")
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()

    # Save plot to a BytesIO buffer and encode it.
    buf = BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode("utf-8")
    buf.close()


    # return buf
    return image_base64
