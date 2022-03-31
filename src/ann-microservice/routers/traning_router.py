from fastapi import APIRouter
from fastapi.responses import HTMLResponse

from tensorflow import keras
from tensorflow.keras import layers

import asyncio
import websockets
import tensorflow as tf
 

#################################################################

backend_base_addr = 'localhost:7220'
uri = f'ws://{backend_base_addr}/ws'

router = APIRouter(prefix="/training")

#################################################################

@router.get("/")
async def make_connection():
    async with websockets.connect(uri = uri) as websocket:
        await websocket.send("Test: hello")
        response = await websocket.recv()
        print(response)
 
asyncio.get_event_loop().run_until_complete(make_connection())