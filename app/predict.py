import joblib
import pandas as pd

from app.config import (
    RF_WEIGHT,
    ISO_WEIGHT,
    DECISION_THRESHOLD,
    HIGH_RISK_THRESHOLD,
    MEDIUM_RISK_THRESHOLD
)

preprocessor = joblib.load('models/preprocessor.joblib')
rf_model = joblib.load('models/random_forest.joblib')
iso_model = joblib.load('models/isolation_forest.joblib')
anomaly_scaler = joblib.load('models/anomaly_scaler.joblib')

feature_order = [
    'Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9',
    'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18',
    'V19', 'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27',
    'V28', 'Amount'
]

def get_risk_level(score):
    if score >= HIGH_RISK_THRESHOLD:
        return 'High'
    elif score >= MEDIUM_RISK_THRESHOLD:
        return 'Medium'
    else:
        return 'Low'
    

def predict_fraud(transaction: dict) -> dict:
    df = pd.DataFrame([transaction], columns=feature_order)
    
    X_processed = preprocessor.transform(df)
    
    fraud_probability = float(rf_model.predict_proba(X_processed)[0, 1])
    
    iso_score = iso_model.decision_function(X_processed)[0]
    flipped_iso_score  = -iso_score
    scaled_iso_score = float(anomaly_scaler.transform(flipped_iso_score.reshape(-1, 1))[0,0])
    
    final_score = RF_WEIGHT * fraud_probability + ISO_WEIGHT * scaled_iso_score
    
    risk_level = get_risk_level(final_score)
    fraud_flag = int(final_score >= DECISION_THRESHOLD)
    
    return {
        "fraud_probability": round(fraud_probability, 6),
        "anomaly_score": round(scaled_iso_score, 6),
        "final_risk_score": round(final_score, 6),
        "risk_level": risk_level,
        "fraud_flag": fraud_flag,
    }