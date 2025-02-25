from pydantic import BaseModel
import numpy as np
from tensorflow.keras.models import load_model
import pickle


# Import functions from your modules and alias them to avoid conflicts.
from .accruacy import generate_prediction_plot as generate_accuracy_plot
from .next5DayPridiction import generate_next_5_prediction_plot


# Load the trained model and scaler.
model = load_model("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Solana\\model.h5")
with open("C:\\Users\\Dell\\OneDrive\\Desktop\\Crypto-Portfolio-Tracker\\AI-backend\\Solana\\scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Define request models.
# class PredictionRequest(BaseModel):
    # prices: list[float]  # A list of the last `time_steps` prices

class PredictionInput(BaseModel):
    last_prices: list[float]  # Exactly 10 price values

# # *================================================================
# @app.post("/predict")
# def predict_price(request: PredictionRequest):
#     # Validate that we have at least 10 prices.
#     if len(request.prices) < 10:
#         raise HTTPException(status_code=400, detail="At least 10 prices are required.")
    
#     # Use the last 10 prices as input.
#     input_data = np.array(request.prices[-10:]).reshape(-1, 1)
#     input_scaled = scaler.transform(input_data)
#     input_scaled = np.expand_dims(input_scaled, axis=0)  # shape: (1, time_steps, 1)
    
#     # Predict the next price (normalized).
#     prediction_scaled = model.predict(input_scaled)
#     # Convert prediction back to original scale.
#     prediction = scaler.inverse_transform(prediction_scaled)
    
#     return {"predicted_price": float(prediction[0][0])}

# # *================================================================

# @app.get("/plot")
# def get_plot():
#     image = generate_accuracy_plot()
#     if image is None:
#         raise HTTPException(status_code=400, detail="Not enough data to generate plot")
#     return {"image": image}

# # *================================================================

def predict_plot_Solana(input_data: PredictionInput):
    try:
        # Call the utility function with user-provided prices from next5DayPridiction module.
        next5_image = generate_next_5_prediction_plot(input_data.last_prices)
        image = generate_accuracy_plot()
        input_data1 = np.array(input_data.last_prices[-10:]).reshape(-1, 1)
        input_scaled1 = scaler.transform(input_data1)
        input_scaled1 = np.expand_dims(input_scaled1, axis=0)  # shape: (1, time_steps, 1)
    
        # Predict the next price (normalized).
        prediction_scaled = model.predict(input_scaled1)
        # Convert prediction back to original scale.
        prediction = scaler.inverse_transform(prediction_scaled)
        
        return {
            "message": "Solana Prediction and accuracy plot generated successfully",
            "next_5_day_plot": next5_image,
            "accuracy_plot": image,
            "predicted_price": float(prediction[0][0])
        }
        # return StreamingResponse(buf, media_type="image/png")
    except ValueError as ve:
        print( "Error: ", ve, "occured")
