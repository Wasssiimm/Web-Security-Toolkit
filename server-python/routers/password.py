from fastapi import APIRouter
from pydantic import BaseModel
from services import entropy_calculator

router = APIRouter()

class PasswordBody(BaseModel):
    password: str

@router.post("/analyze")
def analyze_password(body: PasswordBody):
    return entropy_calculator.analyze(body.password)
