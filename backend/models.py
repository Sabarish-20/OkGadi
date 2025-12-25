from pydantic import BaseModel, Field, ConfigDict, EmailStr, BeforeValidator
from typing import List, Optional, Any, Annotated
from datetime import datetime, timezone
import uuid

# Helper to handle ObjectId to str conversion
PyObjectId = Annotated[str, BeforeValidator(str)]

class MongoBaseModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class User(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id", serialization_alias="id")
    email: EmailStr
    hashed_password: str
    name: str
    role: str = "user" # admin or user
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "manager"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    role: str
    name: str

class Telemetry(BaseModel):
    engineTemp: float
    speed: float
    rpm: float
    fuelLevel: float
    oilPressure: float

class Vehicle(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id", serialization_alias="id")
    name: str
    type: str
    status: str # active, maintenance, etc.
    healthScore: int
    breakdownRisk: int
    telemetryCompleteness: int
    location: str
    driver: Optional[str] = None
    lastMaintenance: Optional[str] = None
    nextMaintenance: Optional[str] = None
    telemetry: Optional[Telemetry] = None
    anomalies: List[str] = []
    totalTrips: int = 0
    totalKm: int = 0

class Trip(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id", serialization_alias="id")
    route: str
    vehicle: str
    driver: str
    status: str # in-progress, completed, etc.
    loadWeight: int
    startTime: datetime
    expectedEnd: datetime
    actualEnd: Optional[datetime] = None
    breakdownRisk: int
    aiConfidence: int
    predictedIssues: List[str] = []
    progress: int = 0

class Alert(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id", serialization_alias="id")
    type: str # critical, warning, info
    title: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False
    vehicle: Optional[str] = None
    trip: Optional[str] = None
    route: Optional[str] = None
