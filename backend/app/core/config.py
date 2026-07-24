import os
import json
from typing import List
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class Settings(BaseModel):
    PORT: int = Field(default=8000)
    ENVIRONMENT: str = Field(default="development")
    MONGO_URI: str = Field(default="mongodb://localhost:27017")
    DATABASE_NAME: str = Field(default="insighthub")
    JWT_SECRET: str = Field(default="4c35be3d-2192-4784-97d2-094261ec64d4-secret-key-insight-hub-saas-platform-2026")
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=720)
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:5173"])
    MAX_UPLOAD_SIZE_MB: int = Field(default=20)

    @classmethod
    def load(cls) -> "Settings":
        cors_raw = os.getenv("CORS_ORIGINS")
        cors_origins = ["http://localhost:5173"]
        if cors_raw:
            try:
                cors_origins = json.loads(cors_raw)
            except Exception:
                cors_origins = [cors_raw]
        
        env = os.getenv("ENVIRONMENT", "development")
        secret = os.getenv("JWT_SECRET", "4c35be3d-2192-4784-97d2-094261ec64d4-secret-key-insight-hub-saas-platform-2026")
        
        if env == "production" and secret == "4c35be3d-2192-4784-97d2-094261ec64d4-secret-key-insight-hub-saas-platform-2026":
            raise RuntimeError("Insecure production deployment: JWT_SECRET must be explicitly configured in production environment.")

        return cls(
            PORT=int(os.getenv("PORT", "8000")),
            ENVIRONMENT=env,
            MONGO_URI=os.getenv("MONGO_URI", "mongodb://localhost:27017"),
            DATABASE_NAME=os.getenv("DATABASE_NAME", "insighthub"),
            JWT_SECRET=secret,
            JWT_ALGORITHM=os.getenv("JWT_ALGORITHM", "HS256"),
            ACCESS_TOKEN_EXPIRE_MINUTES=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "720")),
            CORS_ORIGINS=cors_origins,
            MAX_UPLOAD_SIZE_MB=int(os.getenv("MAX_UPLOAD_SIZE_MB", "20"))
        )

settings = Settings.load()
