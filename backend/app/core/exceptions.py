from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.logging import logger
from app.utils.response_envelope import error_response

class AppException(Exception):
    def __init__(self, message: str, code: str = "INTERNAL_SERVER_ERROR", status_code: int = 500):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(self.message)

class EntityNotFoundError(AppException):
    def __init__(self, message: str, code: str = "NOT_FOUND"):
        super().__init__(message, code, status.HTTP_404_NOT_FOUND)

class ValidationError(AppException):
    def __init__(self, message: str, code: str = "BAD_REQUEST"):
        super().__init__(message, code, status.HTTP_400_BAD_REQUEST)

class AuthError(AppException):
    def __init__(self, message: str, code: str = "UNAUTHORIZED"):
        super().__init__(message, code, status.HTTP_401_UNAUTHORIZED)

class ForbiddenError(AppException):
    def __init__(self, message: str, code: str = "FORBIDDEN"):
        super().__init__(message, code, status.HTTP_403_FORBIDDEN)

class ConflictError(AppException):
    def __init__(self, message: str, code: str = "CONFLICT"):
        super().__init__(message, code, status.HTTP_409_CONFLICT)

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        logger.error(f"Application error [{exc.code}] {exc.message} on path {request.url.path}")
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(code=exc.code, message=exc.message)
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        # Format FastAPI validation errors into a single readable string
        error_messages = []
        for error in exc.errors():
            loc = " -> ".join(str(x) for x in error.get("loc", []))
            msg = error.get("msg", "invalid value")
            error_messages.append(f"{loc}: {msg}")
        
        detail_msg = "; ".join(error_messages)
        logger.warn(f"Validation error on path {request.url.path}: {detail_msg}")
        
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=error_response(code="VALIDATION_ERROR", message=detail_msg)
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.exception(f"Unhandled server exception on path {request.url.path}: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_response(code="INTERNAL_SERVER_ERROR", message="An unexpected error occurred on the server.")
        )
