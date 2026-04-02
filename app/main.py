from fastapi import FastAPI
from app.schemas import TransactionInput, PredictionOutput
from app.predict import predict_fraud
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='Fraud & Anomaly Detection Engine')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {"message": "Welcome to the Fraud & Anomaly Detection Engine API!"}

@app.post('/predict', response_model=PredictionOutput)
def predict(payload: TransactionInput):
    return predict_fraud(payload.model_dump())