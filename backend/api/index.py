import sys
import os

# backend/ root must be on the path so `main`, `database`, etc. are importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mangum import Mangum
from main import app

handler = Mangum(app, lifespan="auto")
