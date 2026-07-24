import logging
import sys

# Configure stdout logging handler
def setup_logging():
    logging_level = logging.INFO
    
    logger = logging.getLogger("insighthub")
    logger.setLevel(logging_level)
    
    # Check if handler is already added to avoid duplicates
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(logging_level)
        formatter = logging.Formatter(
            '[%(asctime)s] [%(levelname)s] [%(name)s] [%(filename)s:%(lineno)d] - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    # Set default level for standard Uvicorn loggers
    logging.getLogger("uvicorn.error").setLevel(logging_level)
    logging.getLogger("uvicorn.access").setLevel(logging_level)

logger = logging.getLogger("insighthub")
setup_logging()
