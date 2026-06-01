from fastapi import APIRouter, Request
from pydantic import BaseModel, ConfigDict, Field
from services import entropy_calculator
from limiter import limiter

router = APIRouter()


class PasswordBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    password: str = Field(min_length=1, max_length=128)


@router.post("/analyze")
@limiter.limit("60/minute")
def analyze_password(request: Request, body: PasswordBody):
    return entropy_calculator.analyze(body.password)
