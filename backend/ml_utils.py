import joblib
import pandas as pd
import numpy as np
import re
import os

# --- PATH CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_artifact(filename):
    path = os.path.join(BASE_DIR, filename)
    try:
        return joblib.load(path)
    except FileNotFoundError:
        print(f"⚠️ Warning: '{filename}' not found.")
        return None

# --- LOAD ARTIFACTS ---
model = load_artifact('animal_price_model.pkl')
preprocessor = load_artifact('preprocessor.pkl') 
price_scaler = load_artifact('price_scaler.pkl') # CRITICAL for your code

def parse_numeric(value_str):
    """
    Cleans inputs like '2.5 years' -> 2.5 or '217 kg' -> 217.0
    """
    try:
        if isinstance(value_str, (int, float)):
            return float(value_str)
        # Extract the first number found in the string
        nums = re.findall(r"[-+]?\d*\.\d+|\d+", str(value_str))
        return float(nums[0]) if nums else 0.0
    except:
        return 0.0

def predict_animal_price(weight, age, breed, color):
    """
    Full pipeline: Clean -> Preprocess (OneHot) -> Predict -> Inverse Scale
    """
    # If files are missing, return a safe dummy value
    if not model or not preprocessor or not price_scaler:
        print("Model files missing. Using fallback logic.")
        return round(parse_numeric(weight) * 850, 2) # Fallback: 850 per kg

    try:
        # 1. CLEAN DATA
        # We assume the frontend sends clean strings or numbers, but we double check
        age_val = parse_numeric(age)
        weight_val = parse_numeric(weight)

        # 2. CREATE DATAFRAME
        # IMPORTANT: The columns must be in the EXACT order as your training X
        # Based on your snippet: age, color, breed, weight
        input_df = pd.DataFrame([{
            'age': age_val,
            'color': color,
            'breed': breed,
            'weight': weight_val
        }])

        # 3. TRANSFORM INPUTS (OneHotEncoding + Scaling X)
        X_processed = preprocessor.transform(input_df)

        # 4. PREDICT (Returns a Z-Score because you scaled Y)
        prediction_z_score = model.predict(X_processed)

        # 5. INVERSE TRANSFORM (Convert Z-Score back to PKR)
        # Reshape is needed because scaler expects 2D array
        prediction_actual = price_scaler.inverse_transform(prediction_z_score.reshape(-1, 1))
        
        # Get the single value
        final_price = float(prediction_actual[0][0])

        return round(final_price, 2)

    except Exception as e:
        print(f"❌ ML Prediction Error: {e}")
        # Fallback if calculation fails
        return round(parse_numeric(weight) * 850, 2)