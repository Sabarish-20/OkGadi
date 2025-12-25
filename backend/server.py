from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from mongomock_motor import AsyncMongoMockClient
import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from passlib.context import CryptContext
from datetime import datetime, timezone

# Import routers
from routes import auth, vehicles, trips, alerts

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'okgaadi')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Attempting to connect to MongoDB at {mongo_url}...")
    try:
        # Try connecting with a short timeout
        app.mongo_client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=2000)
        await app.mongo_client.admin.command('ping')
        app.db = app.mongo_client[db_name]
        app.state.db = app.db
        logger.info("Successfully connected to real MongoDB")
    except Exception as e:
        logger.warning(f"Failed to connect to real MongoDB: {e}")
        logger.warning("Falling back to in-memory Mock Database (mongomock)")
        
        app.mongo_client = AsyncMongoMockClient()
        app.db = app.mongo_client[db_name]
        app.state.db = app.db
        
        # Seed Admin User for Mock DB
        logger.info("Seeding mock database with admin user...")
        admin_user = {
            "email": "admin@okgadi.com",
            "hashed_password": pwd_context.hash("admin123"),
            "name": "Admin User",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        }
        await app.db.users.update_one(
            {"email": admin_user["email"]}, 
            {"$set": admin_user}, 
            upsert=True
        )

        # Seed Standard User for Mock DB
        logger.info("Seeding mock database with standard user...")
        standard_user = {
            "email": "user@okgadi.com",
            "hashed_password": pwd_context.hash("user123"),
            "name": "Standard User",
            "role": "user",
            "created_at": datetime.now(timezone.utc)
        }
        await app.db.users.update_one(
            {"email": standard_user["email"]}, 
            {"$set": standard_user}, 
            upsert=True
        )
        
        logger.info("Mock database seeded. Login with admin@okgadi.com or user@okgadi.com")
        
        # Seed Vehicles
        logger.info("Seeding mock database with vehicles...")
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
            "driver": "DRV003",
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
            "driver": "DRV004",
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
            "driver": "DRV005",
            "totalTrips": 267,
            "totalKm": 54320
          }
        ]
        await app.db.vehicles.insert_many(vehicles)
        
        # Seed Alerts
        logger.info("Seeding mock database with alerts...")
        alerts = [
          {
            "_id": "ALR001",
            "type": "critical",
            "title": "High Breakdown Risk",
            "message": "Vehicle VH003 shows 78% breakdown probability",
            "timestamp": datetime.now(timezone.utc),
            "read": False,
            "vehicle": "VH003"
          },
          {
            "_id": "ALR002",
            "type": "info",
            "title": "Maintenance Due",
            "message": "Vehicle VH001 maintenance scheduled in 5 days",
            "timestamp": datetime.now(timezone.utc),
            "read": True,
            "vehicle": "VH001"
          }
        ]
        await app.db.alerts.insert_many(alerts)

    yield
    # Shutdown
    app.mongo_client.close()
    logger.info("Disconnected from MongoDB")

app = FastAPI(lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
# client = AsyncIOMotorClient(MONGO_URL)
# app.db = client.okgaadi

# Mock DB for development/demo (Using mongomock)
# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(trips.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "OkGadi API Running"}