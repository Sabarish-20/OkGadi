from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import Alert
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user, get_db
from bson import ObjectId

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/", response_model=List[Alert])
async def get_alerts(db: AsyncIOMotorDatabase = Depends(get_db), current_user = Depends(get_current_user)):
    alerts = await db.alerts.find({}).sort("timestamp", -1).to_list(1000)
    return alerts

@router.put("/{alert_id}/read")
async def mark_alert_read(alert_id: str, db: AsyncIOMotorDatabase = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.alerts.update_one({"_id": alert_id}, {"$set": {"read": True}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert marked as read"}

@router.delete("/{alert_id}")
async def delete_alert(alert_id: str, db: AsyncIOMotorDatabase = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.alerts.delete_one({"_id": alert_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted"}
