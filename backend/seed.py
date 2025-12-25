import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'okgaadi')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

async def seed_users():
    await db.users.delete_many({})
    
    users = [
        {
            "email": "admin@okgadi.com",
            "hashed_password": get_password_hash("admin123"),
            "name": "Admin User",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "email": "user@okgadi.com",
            "hashed_password": get_password_hash("user123"),
            "name": "Standard User",
            "role": "user",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    await db.users.insert_many(users)
    print("Users seeded")

async def seed_vehicles():
    await db.vehicles.delete_many({})
    
    vehicles = [
      {
        "_id": "VH001",
        "name": "Tata Ultra T.7",
        "type": "Heavy Truck",
        "status": "active",
        "healthScore": 87,
        "breakdownRisk": 23,
        "telemetryCompleteness": 95,
        "location": "Mumbai Depot",
        "driver": "DRV001",
        "lastMaintenance": "2025-06-15",
        "nextMaintenance": "2025-08-15",
        "telemetry": {
          "engineTemp": 82,
          "speed": 65,
          "rpm": 2200,
          "fuelLevel": 78,
          "oilPressure": 45
        },
        "anomalies": ["High RPM fluctuation"],
        "totalTrips": 234,
        "totalKm": 45620
      },
      {
        "_id": "VH002",
        "name": "Ashok Leyland 3118",
        "type": "Medium Truck",
        "status": "active",
        "healthScore": 92,
        "breakdownRisk": 12,
        "telemetryCompleteness": 98,
        "location": "Delhi Hub",
        "driver": "DRV002",
        "lastMaintenance": "2025-07-01",
        "nextMaintenance": "2025-09-01",
        "telemetry": {
          "engineTemp": 78,
          "speed": 70,
          "rpm": 2100,
          "fuelLevel": 85,
          "oilPressure": 48
        },
        "anomalies": [],
        "totalTrips": 189,
        "totalKm": 38450
      },
      {
        "_id": "VH003",
        "name": "Mahindra Blazo X",
        "type": "Heavy Truck",
        "status": "maintenance",
        "healthScore": 45,
        "breakdownRisk": 78,
        "telemetryCompleteness": 67,
        "location": "Bangalore Service",
        "driver": None,
        "lastMaintenance": "2025-05-20",
        "nextMaintenance": "2025-07-20",
        "telemetry": {
          "engineTemp": 95,
          "speed": 0,
          "rpm": 0,
          "fuelLevel": 34,
          "oilPressure": 32
        },
        "anomalies": ["Engine overheating", "Low oil pressure", "Sensor malfunction"],
        "totalTrips": 312,
        "totalKm": 67890
      },
      {
        "_id": "VH004",
        "name": "BharatBenz 2823R",
        "type": "Heavy Truck",
        "status": "active",
        "healthScore": 95,
        "breakdownRisk": 8,
        "telemetryCompleteness": 99,
        "location": "Chennai Depot",
        "driver": "DRV003",
        "lastMaintenance": "2025-07-10",
        "nextMaintenance": "2025-09-10",
        "telemetry": {
          "engineTemp": 76,
          "speed": 68,
          "rpm": 2050,
          "fuelLevel": 92,
          "oilPressure": 50
        },
        "anomalies": [],
        "totalTrips": 156,
        "totalKm": 32100
      },
      {
        "_id": "VH005",
        "name": "Eicher Pro 6031",
        "type": "Medium Truck",
        "status": "active",
        "healthScore": 71,
        "breakdownRisk": 35,
        "telemetryCompleteness": 82,
        "location": "Pune Hub",
        "driver": "DRV004",
        "lastMaintenance": "2025-06-05",
        "nextMaintenance": "2025-08-05",
        "telemetry": {
          "engineTemp": 88,
          "speed": 62,
          "rpm": 2300,
          "fuelLevel": 56,
          "oilPressure": 42
        },
        "anomalies": ["Irregular fuel consumption"],
        "totalTrips": 267,
        "totalKm": 54320
      }
    ]
    
    await db.vehicles.insert_many(vehicles)
    print("Vehicles seeded")

async def seed_trips():
    await db.trips.delete_many({})
    
    trips = [
      {
        "_id": "TRP001",
        "route": "RT001",
        "vehicle": "VH001",
        "driver": "DRV001",
        "status": "in-progress",
        "loadWeight": 18000,
        "startTime": datetime.now(timezone.utc) - timedelta(hours=5),
        "expectedEnd": datetime.now(timezone.utc) + timedelta(hours=20),
        "breakdownRisk": 23,
        "aiConfidence": 87,
        "predictedIssues": ["High RPM under load"],
        "progress": 45
      },
      {
        "_id": "TRP002",
        "route": "RT002",
        "vehicle": "VH002",
        "driver": "DRV002",
        "status": "in-progress",
        "loadWeight": 12000,
        "startTime": datetime.now(timezone.utc) - timedelta(hours=2),
        "expectedEnd": datetime.now(timezone.utc) + timedelta(hours=5),
        "breakdownRisk": 12,
        "aiConfidence": 94,
        "predictedIssues": [],
        "progress": 68
      },
      {
        "_id": "TRP003",
        "route": "RT004",
        "vehicle": "VH005",
        "driver": "DRV004",
        "status": "completed",
        "loadWeight": 9000,
        "startTime": datetime.now(timezone.utc) - timedelta(days=1),
        "expectedEnd": datetime.now(timezone.utc) - timedelta(hours=20),
        "actualEnd": datetime.now(timezone.utc) - timedelta(hours=19),
        "breakdownRisk": 35,
        "aiConfidence": 76,
        "predictedIssues": ["Driver fatigue risk"],
        "progress": 100
      }
    ]
    
    await db.trips.insert_many(trips)
    print("Trips seeded")

async def seed_alerts():
    await db.alerts.delete_many({})
    
    alerts = [
      {
        "_id": "ALR001",
        "type": "critical",
        "title": "High Breakdown Risk",
        "message": "Vehicle VH003 shows 78% breakdown probability",
        "timestamp": datetime.now(timezone.utc) - timedelta(minutes=30),
        "read": False,
        "vehicle": "VH003"
      },
      {
        "_id": "ALR002",
        "type": "warning",
        "title": "Low AI Confidence",
        "message": "Trip TRP003 prediction confidence below 80%",
        "timestamp": datetime.now(timezone.utc) - timedelta(hours=2),
        "read": False,
        "trip": "TRP003"
      },
      {
        "_id": "ALR003",
        "type": "info",
        "title": "Maintenance Due",
        "message": "Vehicle VH001 maintenance scheduled in 5 days",
        "timestamp": datetime.now(timezone.utc) - timedelta(hours=5),
        "read": True,
        "vehicle": "VH001"
      }
    ]
    
    await db.alerts.insert_many(alerts)
    print("Alerts seeded")

async def main():
    await seed_users()
    await seed_vehicles()
    await seed_trips()
    await seed_alerts()
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
