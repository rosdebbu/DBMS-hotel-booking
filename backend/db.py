import pymysql
from dbutils.pooled_db import PooledDB
from config import Config

pool = None

def init_db():
    global pool
    pool = PooledDB(
        creator=pymysql,
        maxconnections=10,
        mincached=2,
        maxcached=5,
        blocking=True,
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
        cursorclass=pymysql.cursors.DictCursor
    )

def get_db_connection():
    if not pool:
        init_db()
    return pool.connection()
