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
 
async def make_connection():
    async with websockets.connect(uri = BACKEND_URI) as websocket:
        await websocket.send("change me!")
        response = await websocket.recv()
        print(response)

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

def read_json_data(json_file):
    return json.load(json_file) 

# # #

def stored_dataset_to_dataframe(dataset):
    json_data = read_json_data(dataset.file)
    return pd.DataFrame(json_data['parsedDataset'])


#################################################################

#asyncio.get_event_loop().run_until_complete(make_connection()) # hide-ovano jer pri ucitavanju inicira kreiranje socket-a
