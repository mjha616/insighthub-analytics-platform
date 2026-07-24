from fastapi import FastAPI, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import logger
from app.db.mongo_client import connect_to_mongo, close_mongo_connection, get_database
from app.db.indexes import create_indexes
from app.utils.response_envelope import error_response, success_response
from app.utils.limiter import limiter

# 1. Initialize API routers
from app.api.v1.routes.auth_routes import router as auth_router
from app.api.v1.routes.project_routes import router as project_router
from app.api.v1.routes.dataset_routes import router as dataset_router
from app.api.v1.routes.analytics_routes import router as analytics_router
from app.api.v1.routes.dashboard_routes import router as dashboard_router
from app.api.v1.routes.report_routes import router as report_router

# 2. FastAPI Application Factory
def create_app() -> FastAPI:
    app = FastAPI(
        title="InsightHub API",
        description="Production-Grade Data Analytics SaaS Backend",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json"
    )

    # Rate Limiting configuration
    app.state.limiter = limiter
    
    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
        logger.warn(f"Rate limit exceeded on path {request.url.path} from client {request.client.host}")
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content=error_response(
                code="RATE_LIMIT_EXCEEDED",
                message=f"Rate limit exceeded: {exc.detail}"
            )
        )

    # Configure CORS (Cross-Origin Resource Sharing)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register Exception Handlers
    register_exception_handlers(app)

    # Database lifecycle connections
    @app.on_event("startup")
    async def startup_db_client():
        await connect_to_mongo()
        await create_indexes()

    @app.on_event("shutdown")
    async def shutdown_db_client():
        await close_mongo_connection()

    # Health check endpoint
    @app.get("/", tags=["Health"])
    async def health_check():
        db_status = "unhealthy"
        try:
            db = get_database()
            await db.command("ping")
            db_status = "healthy"
        except Exception:
            pass
            
        return success_response({
            "status": "healthy" if db_status == "healthy" else "degraded",
            "environment": settings.ENVIRONMENT,
            "database": db_status
        })

    # Register routes
    api_prefix = "/api/v1"
    app.include_router(auth_router, prefix=api_prefix)
    app.include_router(project_router, prefix=api_prefix)
    app.include_router(dataset_router, prefix=api_prefix)
    app.include_router(analytics_router, prefix=api_prefix)
    app.include_router(dashboard_router, prefix=api_prefix)
    app.include_router(report_router, prefix=api_prefix)

    return app

app = create_app()
