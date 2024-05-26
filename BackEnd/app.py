from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from Services.SignIn_service import signin
from Routing.AStar import execute_algorithm
from typing import Tuple

app = FastAPI()

# Configure CORS for development. Consider narrowing down the allowed origins for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify domains for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SigninRequest(BaseModel):
    username: str
    password: str

@app.post("/signin")
def signin_endpoint(request: SigninRequest):
    # Implement try-except for error handling (example)
    try:
        user = signin(request.username, request.password)
        if user is None:  # Example condition to check authentication success
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/calculate_path")
def calculate_path_endpoint(start: Tuple[float, float], end: Tuple[float, float]):
    start = (start[1], start[0])
    end = (end[1], end[0])
    path = execute_algorithm(start, end)
    print(path)
    return path

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
