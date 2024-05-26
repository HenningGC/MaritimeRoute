import csv
from fastapi import HTTPException
import os
import logging

def load_mock_users():
    mock_users = []
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(BASE_DIR, 'Services', 'MockUsers.csv')
    try:
        with open(csv_path, "r") as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                mock_users.append(row)
    except Exception as e:
        logging.error(f"Failed to load mock users: {e}")
        raise
    return mock_users

def signin(username: str, password: str):
    mock_users = load_mock_users()
    for user in mock_users:
        if user["username"] == username and user["password"] == password:
            return {"message": "Login successful"}
    
    raise HTTPException(status_code=401, detail="Invalid username or password")
