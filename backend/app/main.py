"""FastAPI application entry point for the Air Quality Predictor backend."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import auth, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Air Quality Predictor API",
    description="Inteligentny system prognozowania jakości powietrza i smogu",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(dashboard.router)


@app.get("/", tags=["Health"])
def root():
    """Health-check endpoint."""
    return {
        "status": "ok",
        "app": "Air Quality Predictor API",
        "version": "0.1.0",
    }
