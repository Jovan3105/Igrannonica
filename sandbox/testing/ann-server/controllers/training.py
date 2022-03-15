from flask_restful import Resource

class Training(Resource):
    def get(self, tid):
        return {"some id":tid}   