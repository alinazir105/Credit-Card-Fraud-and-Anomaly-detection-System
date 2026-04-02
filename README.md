# Fraud & Anomaly Detection Engine

**Live Demo (Frontend):**
[https://credit-card-fraud-and-anomaly-detec.vercel.app/](https://credit-card-fraud-and-anomaly-detec.vercel.app/)

**API (Backend):**
[https://credit-card-fraud-and-anomaly-detection.onrender.com/docs](https://credit-card-fraud-and-anomaly-detection.onrender.com/docs)

---

## Overview

This project implements a **production-ready fraud detection system** designed for highly imbalanced financial transaction data.

Rather than treating fraud detection as a simple classification problem, this system adopts a **risk-based approach**, combining:

* Supervised Learning (Random Forest)
* Unsupervised Anomaly Detection (Isolation Forest)

to generate a unified **risk score** for each transaction.

The system is deployed end-to-end with:

* **FastAPI backend (Render)**
* **React frontend (Vercel)**

---

## Problem Statement

Fraud detection is a **rare-event problem**:

* ~99.8% transactions are legitimate
* ~0.2% are fraudulent

This creates critical challenges:

* Accuracy becomes misleading
* Models ignore minority class
* High recall → too many false positives
* False positives disrupt real customers

Therefore, the goal is:

> Detect fraud effectively while minimizing disruption to legitimate users

---

## Approach

### 1. Exploratory Data Analysis

* Fraud vs non-fraud distribution
* Transaction behavior patterns
* Feature separability
* Outlier characteristics

---

### 2. Baseline Modeling

* Logistic Regression
* Random Forest
* XGBoost

---

### 3. Handling Class Imbalance

* Class weighting
* SMOTE (synthetic oversampling)
* Threshold tuning

---

### 4. Model Evaluation

Metrics used:

* Precision (minimize false alarms)
* Recall (capture fraud)
* F1-score
* ROC-AUC & PR-AUC

---

### 5. Anomaly Detection

Isolation Forest used to:

* detect unusual patterns
* capture unseen fraud behavior
* complement supervised model

---

### 6. Hybrid Risk Scoring 

Final system combines:

```text
Final Score = (0.8 × Fraud Probability) + (0.2 × Anomaly Score)
```

This allows:

* strong reliance on learned fraud patterns
* additional signal from anomaly detection

---

## System Architecture

```text
User Input (Frontend)
        ↓
FastAPI Backend
        ↓
Preprocessing Pipeline
        ↓
Random Forest → Fraud Probability
        ↓
Isolation Forest → Anomaly Score
        ↓
Score Scaling & Alignment
        ↓
Weighted Combination
        ↓
Final Risk Score
        ↓
Risk Level + Fraud Flag
```

---

## Results

| Model                   | Precision | Recall   |
| ----------------------- | --------- | -------- |
| Logistic Regression     | 0.83      | 0.63     |
| Random Forest           | 0.94      | 0.82     |
| XGBoost                 | 0.87      | 0.80     |
| SMOTE Logistic          | 0.53      | 0.88     |
| Weighted Logistic       | 0.06      | 0.92     |
| **Tuned Random Forest** | **0.94**  | **0.83** |

### Key Insights

* Random Forest achieved the best balance
* SMOTE increased recall but caused too many false positives
* Class weighting destabilized precision
* Isolation Forest alone was insufficient but useful as a supporting signal
* Hybrid model improved interpretability and robustness

---

## API

### Endpoint

```http
POST /predict
```

---

### Input

Transaction with features:

* Time
* Amount
* V1 → V28

---

### Output

```json
{
  "fraud_probability": float,
  "anomaly_score": float,
  "final_risk_score": float,
  "risk_level": "Low | Medium | High",
  "fraud_flag": 0 or 1
}
```

---

## Example

### Request

```json
{
  "Time": 4462,
  "Amount": 239.93,
  "V1": -2.303349568,
  "V2": 1.75924746,
  ...
}
```

---

### Response

```json
{
  "fraud_probability": 0.77,
  "anomaly_score": 0.448186,
  "final_risk_score": 0.705637,
  "risk_level": "High",
  "fraud_flag": 1
}
```

---

## Frontend Features

* Interactive form input (no coding required)
* JSON input mode
* Real-time prediction
* Risk visualization (score bars)
* Sample fraud & legitimate test cases

---

## Tech Stack

### Backend

* Python
* FastAPI
* Scikit-learn
* XGBoost
* Joblib

### Frontend

* React (Vite)
* Vanilla UI (no heavy frameworks)

### Deployment

* Render (Backend)
* Vercel (Frontend)

---

## Run Locally

### Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Future Improvements

* Probability calibration (Platt / Isotonic)
* Advanced anomaly models (LOF, Autoencoders)
* Batch prediction endpoint
* Real-time monitoring & drift detection
* User-friendly feature abstraction (remove PCA inputs)
* Dashboard for fraud analysts

---

## Author
[Ali Nazir](www.linkedin.com/in/ali-nazir-74b909275)
