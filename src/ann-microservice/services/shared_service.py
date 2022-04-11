import io
import json
import asyncio
import websockets
import urllib, base64
import pandas as pd
import matplotlib.pyplot as plt

#################################################################

PRINT_PREFIX = "####:     "
BACKEND_BASE_ADDRESS = 'localhost:7220'
BACKEND_URI = f'ws://{BACKEND_BASE_ADDRESS}/ws'
 
#################################################################
 
async def make_connection(destId,msg):
    obj={
        "From":"me",
        "To":"you",
        "Message":"FROMPYTHONS"
    }
    async with websockets.connect("ws://localhost:7220") as websocket:
        responce= await websocket.recv()
        obj["From"]=responce
        obj["To"]=destId
        obj["Message"]=msg
        await websocket.send(json.dumps(obj))
        #print(responce)

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

def log(msg):
    '''
    Stampa prosledjenu poruku i na nju dodaje odgovarajuci prefiks
    '''
    print(PRINT_PREFIX + msg)
 
# # #

def read_json_data(url):
    json_data = None
    with urllib.request.urlopen(url) as data:
        json_data = data.read()

    return json.loads(json_data)


#################################################################

#asyncio.get_event_loop().run_until_complete(make_connection()) # hide-ovano jer pri ucitavanju inicira kreiranje socket-a
