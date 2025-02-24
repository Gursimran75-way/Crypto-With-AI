from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from tensorflow.keras.models import load_model
import pickle

from fastapi.responses import StreamingResponse

# Import functions from your modules and alias them to avoid conflicts.
from accruacy import generate_prediction_plot as generate_accuracy_plot
from next5DayPridiction import generate_next_5_prediction_plot

app = FastAPI()

# Configure CORS middleware.
origins = ["http://localhost:5173"]  # Adjust as needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or use origins if you want to restrict.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and scaler.
model = load_model("model.h5")
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Define request models.
class PredictionRequest(BaseModel):
    prices: list[float]  # A list of the last `time_steps` prices

class PredictionInput(BaseModel):
    last_prices: list[float]  # Exactly 10 price values

@app.post("/predict")
def predict_price(request: PredictionRequest):
    # Validate that we have at least 10 prices.
    if len(request.prices) < 10:
        raise HTTPException(status_code=400, detail="At least 10 prices are required.")
    
    # Use the last 10 prices as input.
    input_data = np.array(request.prices[-10:]).reshape(-1, 1)
    input_scaled = scaler.transform(input_data)
    input_scaled = np.expand_dims(input_scaled, axis=0)  # shape: (1, time_steps, 1)
    
    # Predict the next price (normalized).
    prediction_scaled = model.predict(input_scaled)
    # Convert prediction back to original scale.
    prediction = scaler.inverse_transform(prediction_scaled)
    
    return {"predicted_price": float(prediction[0][0])}

@app.get("/plot")
def get_plot():
    image = generate_accuracy_plot()
    if image is None:
        raise HTTPException(status_code=400, detail="Not enough data to generate plot")
    return {"image": image}

@app.post("/predict-plot")
def predict_plot_endpoint(input_data: PredictionInput):
    try:
        # Call the utility function with user-provided prices from next5DayPridiction module.
        buf = generate_next_5_prediction_plot(input_data.last_prices)
        return StreamingResponse(buf, media_type="image/png")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
