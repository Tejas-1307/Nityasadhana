import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.auth import router as auth_router
from app.api.routes.invitations import router as invitations_router
from app.api.routes.relationships import router as relationships_router
from app.api.routes.reports import router as reports_router
from app.api.routes.notifications import router as notifications_router
from app.api.routes.sankalpa import router as sankalpa_router
from app.api.routes.reflections import router as reflections_router
from app.api.routes.guru import router as guru_router
from app.api.routes.guru_dashboard import router as guru_dashboard_router
from app.core.config import get_settings
from app.core.database import Base, engine

logger = logging.getLogger("nityasadhana.backend")


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


settings = get_settings()
Base.metadata.create_all(bind=engine)
app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server error processing %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )


app.include_router(auth_router, prefix="/api")
app.include_router(invitations_router, prefix="/api")
app.include_router(relationships_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")
app.include_router(sankalpa_router, prefix="/api")
app.include_router(reflections_router, prefix="/api")
app.include_router(guru_router, prefix="/api")
app.include_router(guru_dashboard_router, prefix="/api")


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}

