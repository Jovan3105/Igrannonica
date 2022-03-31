import uvicorn
import sys
from fastapi import FastAPI

from routers import dataprep, datastatistics

#################################################################

description = """
Mikroservis za Artifical Neural Network playground web platformu

## Data Preparation

TODO

## Training

TODO
"""

tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users. The **login** logic is also here.",
    }
]

app = FastAPI(#__name__, 
    title="ANN mikroservice",
    description=description
    )

host_name = "localhost"
server_port = 8081
dev_mode = False

#################################################################
# Routers

app.include_router(dataprep.router)
app.include_router(datastatistics.router)

#################################################################

if __name__ == "__main__":      
    dev_str = ''
    if len(sys.argv) > 1 and sys.argv[1] == 'dev':
        dev_mode = True
        dev_str = ' in dev mode'

    uvicorn.run("ann_server:app", host=host_name, port=server_port, reload=True, workers=4, debug=dev_mode)  
