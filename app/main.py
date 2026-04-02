from fastapi import FastAPI
from app.schemas import TransactionInput, PredictionOutput
from app.predict import predict_fraud

app = FastAPI(title='Fraud & Anomaly Detection Engine')

@app.get('/')
def root():
    return {"message": "Welcome to the Fraud & Anomaly Detection Engine API!"}

@app.post('/predict', response_model=PredictionOutput)
def predict(payload: TransactionInput):
    return predict_fraud(payload.model_dump())