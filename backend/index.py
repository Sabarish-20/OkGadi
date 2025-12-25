from server import app

# Vercel needs a variable named 'app' to be exposed.
# Since our FastAPI app is already named 'app' in server.py,
# this file just imports it to make it available at the entry point level.
