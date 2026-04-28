import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '1234')
    MYSQL_DB = os.getenv('MYSQL_DB', 'Hotel_Management_System')
    SECRET_KEY = os.getenv('SECRET_KEY', 'my-super-secret-key-1234')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173')
