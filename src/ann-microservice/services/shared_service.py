import io
import json
import asyncio
import websockets
import urllib, base64
import pandas as pd
import matplotlib.pyplot as plt
import logging

import config

#################################################################

BACKEND_WEB_SOCKET_URI = f'ws://{config.BACKEND_BASE_ADDRESS}/ws'
LOGGER = logging.getLogger('uvicorn.error')
socket_message = {
    "From":"me",
    "To":"you",
    "Message":""
}
 
#################################################################

def log(output):
    '''
    Ispisuje prosledjeni objekat. Ukoliko je instanca stringa na njega dodaje prefiks PRINT_PREFIX i onda sve zajedno ispise, 
    dok u suprotnom samo ispisuje prosledjeni objekat

    **Ispis se vrsi samo u development modu**
    '''
    
    if isinstance(output, str):
        LOGGER.info(config.PRINT_PREFIX + output)
    else:
        LOGGER.info(output)
 
async def make_socket_connection():
    ''' 
    Kreira konekciju i vraca client id za dati socket conn
    '''

    async with websockets.connect(uri = BACKEND_WEB_SOCKET_URI) as websocket:
        return await websocket.recv()


async def send_msg(my_id, dest_id, msg):
    
    async with websockets.connect(uri = BACKEND_WEB_SOCKET_URI) as websocket:
        socket_message["From"] = my_id
        socket_message["To"] = dest_id
        socket_message["Message"] = msg

        await websocket.send(json.dumps(obj))

# # #

def figure_to_uri(figure, ext='png'):
    '''
    Za prosledjenu matplot figuru vraca uri base64 encoded slike.
    '''
    buf = io.BytesIO()
    figure.savefig(buf, format=ext)
    buf.seek(0)
    base64Img = base64.b64encode(buf.read())

    return 'data:image/png;base64,' + urllib.parse.quote(base64Img)
    
# # #   

def read_json_data(url):
    json_data = None
    with urllib.request.urlopen(url) as data:
        json_data = data.read()

    return json.loads(json_data)

#################################################################

#asyncio.get_event_loop().run_until_complete(make_connection()) # hide-ovano jer pri ucitavanju inicira kreiranje socket-a
