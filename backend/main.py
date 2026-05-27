from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import traces, extract, user_traces

app = FastAPI(title="Delta API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(traces.router, prefix="/api")
app.include_router(extract.router, prefix="/api")
app.include_router(user_traces.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
