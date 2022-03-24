from flask_restful import Resource, request, reqparse
from services.dataprep_service import *
import werkzeug

class Training(Resource):
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument(
            'dataset',
            type=werkzeug.datastructures.FileStorage, 
            location='files',
            required=True
        )
        args = parser.parse_args(strict=True)
        print(args)
        dataset_file = request.files['dataset']

        return {'min' : 100, "max" : 1200, "mean":560,"avg":740.4 }, 200