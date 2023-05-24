from loguru import logger
import sys
import os
_ = os.path.abspath(os.path.dirname(__file__))  # 返回当前文件路径
root_path = os.path.abspath(os.path.join(_, './'))  # 返回当前目录文件夹
sys.path.append(root_path)
log_path = root_path + "/logs"
if not os.path.exists(log_path):
    os.mkdir(log_path)

logger.configure(
    handlers=[
        dict(sink=log_path+"/main.log", 
             enqueue=True, 
             diagnose=True, 
             catch=True, 
             rotation="100 MB", 
             compression="zip", 
             backtrace=True, 
             colorize=False
             ),
        dict(sink=sys.stderr, 
             enqueue=True, 
             diagnose=True, 
             catch=True, 
             backtrace=True, 
             colorize=True
             ),
    ]
)
logger.info("loguru logger init completed.")

from typing import Union
from fastapi import FastAPI
from models.items import Item

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}