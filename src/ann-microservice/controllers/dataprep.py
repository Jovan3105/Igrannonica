from flask_restful import Resource, request
from services.dataprep_service import *

class DatasetParsing(Resource):
    def post(self):
        body = request.files['dataset']
        parsed_dataset, column_types = parse_dataset(request.files['dataset'].filename, body)

        return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types }, 200    