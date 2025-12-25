import asyncio
from mongomock_motor import AsyncMongoMockClient
import os

async def main():
    print("Testing mongomock_motor...")
    try:
        client = AsyncMongoMockClient()
        db = client['test_db']
        print("Client created")
        
        await db.users.insert_one({"name": "test"})
        print("Insert successful")
        
        user = await db.users.find_one({"name": "test"})
        print(f"Find successful: {user}")
        
        await db.users.update_one({"name": "test"}, {"$set": {"role": "admin"}}, upsert=True)
        print("Update successful")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
