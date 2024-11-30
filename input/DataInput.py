from pydantic import BaseModel

class DataInput(BaseModel):
    message: str
    secret: str