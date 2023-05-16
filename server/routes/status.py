from enum import Enum

class StatusCode(Enum):
    OK = 200
    UNAUTHORIZED = 401
    NOT_ALLOWED = 405
    INTERNAL_SERVER_ERROR = 500