# Crypto Portfolio Tracker - AI Price Prediction

## Overview
This project is a **Crypto Portfolio Tracker** that includes an **AI-powered price prediction feature** for **Bitcoin (BTC), Solana (SOL), and Ethereum (ETH)**. The AI feature utilizes an **LSTM (Long Short-Term Memory) model** to analyze historical price data and predict future prices.

## Features
### 🌟 **Crypto Portfolio Tracking**
- View real-time prices of BTC, SOL, and ETH.
- Track your holdings and portfolio value.

### 🤖 **AI-Powered Price Prediction**
- Uses an **LSTM neural network** for price forecasting.
- Trained on **historical price data**.
- Predicts the next price based on **the last 10 time steps**.

### 📈 **Visualization**
- Generates a graph of **actual vs. predicted prices**.
- Interactive UI to view historical trends and predictions.

## AI Model - How It Works
1. **Data Collection:** Fetches historical prices from Yahoo Finance.
2. **Data Preprocessing:**
   - Converts prices to numerical format.
   - Applies MinMax Scaling for normalization.
   - Splits data into training and testing sets.
3. **Model Training:**
   - Uses an **LSTM-based neural network**.
   - Trained to predict the next price based on the last 10 prices.
4. **Prediction:**
   - Takes recent 10 prices as input.
   - Predicts the next price.
   - Displays the results in an interactive graph.

## Installation & Setup
### 📌 **Backend (AI Model Processing)**
1. Clone the repository:
   ```bash
   git clone https://github.com/Gursimran75-way/crypto-AI.git
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the AI backend:
   ```bash
   python app.py
   ```

### 📌 **Frontend (Crypto Dashboard)**
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm start
   ```
   
## Usage
- **View Crypto Prices** 📊: Displays live crypto prices.
- **Predict Future Prices** 🔮: Enter recent data points and get AI-driven predictions.
- **Analyze Trends** 📈: Visualize predictions vs. actual prices.

## Technologies Used
### 🔧 **Frontend**
- React.js
- Tailwind CSS
- Chart.js (for visualization)

### 🔧 **Backend (AI Processing)**
- Python (Flask API)
- TensorFlow / Keras (LSTM Model)
- Scikit-learn (Data Preprocessing)
- Pandas, NumPy (Data Handling)
- Matplotlib, Seaborn (Visualization)

## Future Enhancements
✅ Support for more cryptocurrencies 📌
✅ Advanced AI models (GRU, Transformer-based) 🚀
✅ Improved UI for better analysis 📊

## Contributing
Feel free to contribute! Fork the repo and submit a pull request. 💡


