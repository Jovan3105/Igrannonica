from flask import Flask
from flask_restful import Resource, Api
from controllers.dataprep import *
from controllers.training import *


app = Flask(__name__)
api = Api(app)

hostName = "localhost"
serverPort = 8081

#################################################################
# Resources & routes

api.add_resource(DatasetParsing, '/datasetparsing')
api.add_resource(Training, '/training/<int:tid>')
api.init_app(app)

#################################################################

if __name__ == "__main__":        
    app.run(
        host=hostName, 
        port=serverPort, 
        threaded=True, # thread per request
        debug=True)
    print("Server started http://%s:%s" % (hostName, serverPort))
