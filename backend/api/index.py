import sys
import os
import asyncio

# backend/ root must be on the path so `main`, `database`, etc. are importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app          # also imports models, registering them on Base.metadata
from database import engine, Base
from mangum import Mangum


async def _create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Run once at cold-start, before any request is served.
# asyncio.run() is safe here because no event loop is running during module import.
asyncio.run(_create_tables())

handler = Mangum(app, lifespan="off")
