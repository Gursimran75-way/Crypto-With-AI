import yfinance as yf
import numpy as np
# import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import pickle

# === 1. Data Collection ===
# Fetch historical data for Bitcoin (BTC-USD) from Yahoo Finance
ticker = "BTC-USD"
data = yf.download(ticker, start="2014-10-01", end="2025-02-24")
# We assume 'Close' column is the daily closing price
data = data[['Close']]
data.rename(columns={'Close': 'price'}, inplace=True)

# Save data locally if needed (optional)    
data.to_csv("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Bitcoin\\historical_prices.csv", index=True)

# === 2. Data Preprocessing ===
prices = data['price'].values.reshape(-1, 1)#convert to 2D numpy array[ [1],[2],[3] ]

prices = prices[:-100] # Exclude last 100 days for testing

# Normalize the data to (0,1)
scaler = MinMaxScaler(feature_range=(0, 1))
prices_scaled = scaler.fit_transform(prices)

# Create sequences for training
def create_dataset(dataset, time_steps=10):
    X, y = [], []
    for i in range(len(dataset) - time_steps):
        X.append(dataset[i : i + time_steps, 0])
        y.append(dataset[i + time_steps, 0])
    return np.array(X), np.array(y)

time_steps = 10
X, y = create_dataset(prices_scaled, time_steps)
X = X.reshape((X.shape[0], X.shape[1], 1))# Convert X to 3D array (no'of samples,time_steps,features)

# === 3. Build and Train the LSTM Model ===
model = Sequential([
    LSTM(50, activation='relu', input_shape=(time_steps, 1)),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')

# Train the model
model.fit(X, y, epochs=50, batch_size=16, verbose=1)

# === 4. Save the Model and Scaler ===
model.save("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Bitcoin\\model.h5")
with open("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Bitcoin\\scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

print("Model and scaler saved successfully.")
