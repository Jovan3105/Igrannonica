from flask_restful import Resource
from services.templateservice import *

class DataPreparation(Resource):
    def get(self):
        return template_method()

    def post(self):
        body = request.get_json()

        return {'sent body':body}    