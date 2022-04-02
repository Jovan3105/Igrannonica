import io
import asyncio
import websockets
import urllib, base64
import matplotlib.pyplot as plt

#################################################################

backend_base_addr = 'localhost:7220'
uri = f'ws://{backend_base_addr}/ws'
 
#################################################################
 
async def make_connection():
    async with websockets.connect(uri = uri) as websocket:
        await websocket.send("hello there")
        response = await websocket.recv()
        print(response)


async def image_to_uri(plt, ext='png'):
    fig = plt.gcf()

    buf = io.BytesIO()
    fig.savefig(buf, format=ext)
    buf.seek(0)
    string = base64.b64encode(buf.read())

    uri = 'data:image/png;base64,' + urllib.parse.quote(string)
    return uri
 
#################################################################

#asyncio.get_event_loop().run_until_complete(make_connection()) # hide-ovano jer pri ucitavanju inicira kreiranje socket-a
