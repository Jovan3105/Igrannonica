from flask_restful import Resource, request, reqparse
from services.dataprep_service import *
import werkzeug


class DatasetParsing(Resource):
    def post(self):

        parser = reqparse.RequestParser(bundle_errors=True)
 

        parser.add_argument('delimiter', type=str, location='form')
        parser.add_argument('lineterminator', type=str, location='form')
        parser.add_argument('quotechar', type=str, location='form')
        parser.add_argument('escapechar', type=str, location='form')
        parser.add_argument('encoding', type=str, location='form')
        parser.add_argument(
            'dataset',
            type=werkzeug.datastructures.FileStorage, 
            location='files',
            required=True
        )
        args = parser.parse_args(strict=True)
        print(args)
        dataset_file = request.files['dataset']

        parsed_dataset, column_types = parse_dataset(
            dataset_file,
            delimiter = args['delimiter'], 
            lineterminator = args['lineterminator'], 
            quotechar = '"' if args['quotechar'] == None else args['quotechar'], 
            escapechar = args['escapechar'], 
            encoding = args['encoding'] 
            )

        return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types }, 200    