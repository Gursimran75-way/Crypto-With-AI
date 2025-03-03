from pydantic import BaseModel
import numpy as np
from tensorflow.keras.models import load_model
import pickle


from .accruacy import generate_prediction_plot as generate_accuracy_plot
from .next5DayPridiction import generate_next_5_prediction_plot


# Load the trained model and scaler.
model = load_model("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Etherium\\model.h5")
with open("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Etherium\\scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

class PredictionInput(BaseModel):
    last_prices: list[float]  # Exactly 10 price values

def predict_plot_Etherium(input_data: PredictionInput):
    try:
        # Call the utility function with user-provided prices from next5DayPridiction module.
        next5_image = generate_next_5_prediction_plot(input_data.last_prices)
        image, accuracy_metrics = generate_accuracy_plot()
        input_data1 = np.array(input_data.last_prices[-10:]).reshape(-1, 1)
        input_scaled1 = scaler.transform(input_data1)
        input_scaled1 = np.expand_dims(input_scaled1, axis=0)  # shape: (1, time_steps, 1)
    
        # Predict the next price (normalized).
        prediction_scaled = model.predict(input_scaled1)
        # Convert prediction back to original scale.
        prediction = scaler.inverse_transform(prediction_scaled)
        
        return {
            "message": "Etherium Prediction and accuracy plot generated successfully",
            "next_5_day_plot": next5_image,
            "accuracy_plot": image,
            "predicted_price": float(prediction[0][0]),
            "accuracy_metrics": accuracy_metrics
        }
    except ValueError as ve:
        print( "Error: ", ve, "occured")
