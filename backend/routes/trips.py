from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import Trip
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user, get_db

router = APIRouter(prefix="/trips", tags=["trips"])

@router.get("/", response_model=List[Trip])
async def get_trips(db: AsyncIOMotorDatabase = Depends(get_db), current_user = Depends(get_current_user)):
    trips = await db.trips.find({}).to_list(1000)
    return trips

@router.post("/", response_model=Trip)
async def create_trip(trip: Trip, db: AsyncIOMotorDatabase = Depends(get_db), current_user = Depends(get_current_user)):
    await db.trips.insert_one(trip.model_dump(by_alias=True))
    return trip
