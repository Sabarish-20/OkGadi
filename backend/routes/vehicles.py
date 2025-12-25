from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import Vehicle
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user, get_db

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

@router.get("/", response_model=List[Vehicle])
async def get_vehicles(db: AsyncIOMotorDatabase = Depends(get_db), current_user = Depends(get_current_user)):
    vehicles = await db.vehicles.find({}).to_list(1000)
    return vehicles

@router.get("/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str, db: AsyncIOMotorDatabase = Depends(get_db), current_user = Depends(get_current_user)):
    vehicle = await db.vehicles.find_one({"_id": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.post("/", response_model=Vehicle)
async def create_vehicle(vehicle: Vehicle, db: AsyncIOMotorDatabase = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create vehicles")
        
    await db.vehicles.insert_one(vehicle.model_dump(by_alias=True))
    return vehicle
