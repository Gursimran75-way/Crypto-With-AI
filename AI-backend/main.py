from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from Bitcoin.app import predict_plot_bitcoin
from Etherium.app import predict_plot_Etherium
from Solana.app import predict_plot_Solana
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or use origins if you want to restrict.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionInput(BaseModel):
    last_prices: list[float]  # Exactly 10 price values


# *==================== BTC-API Endpoints ====================*
@app.post("/predict-plot/bitcoin")
def predict_plot_BTC(input_data: PredictionInput):
    try:
        result = predict_plot_bitcoin(input_data)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    

# *==================== ETH-API Endpoints ====================*
@app.post("/predict-plot/etherium")
def predict_plot_ETH(input_data: PredictionInput):
    try:
        result = predict_plot_Etherium(input_data)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    
# *==================== SOL-API Endpoints ====================*
@app.post("/predict-plot/solana")
def predict_plot_SOL(input_data: PredictionInput):
    try:
        result = predict_plot_Solana(input_data)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))