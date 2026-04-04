from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    firebase_uid: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    firebase_uid: str
    giros: int = 0
    tipo: Literal["user", "admin"] = "user"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    id: str
    email: str
    giros: int
    tipo: str

class SpinRequest(BaseModel):
    user_id: str

class SpinResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    premio: str
    dias: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AddGirosRequest(BaseModel):
    user_email: str
    quantidade: int
    admin_email: str

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    tipo: Literal["adicao", "uso"]
    quantidade: int
    admin_email: Optional[str] = None
    motivo: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
