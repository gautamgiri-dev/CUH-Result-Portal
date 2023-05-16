import os
import json

from flask import Flask,render_template, send_file, make_response
from flask_cors import CORS

from services.database.database_service import DatabaseService
from controllers.users import UserController
from controllers.hods import HodController
from controllers.students import StudentController
from controllers.meta import MetaController

from routes.users import UserRoute
from routes.hods import HodRoute
from routes.students import StudentRoute
from routes.meta import MetaRoute

from dev.url_map_serializer import dump_url_map

config = json.load(open('config.json', 'r'))
app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['UPLOAD-DIR'] = os.path.join(os.getcwd(), config['DIRS']['UPLOAD-DIR'])
app.config['RESULT-DIR'] = os.path.join(os.getcwd(), config['DIRS']['RESULT-DIR'])
app.config['DEV-ASSETS-DIR'] = os.path.join(os.getcwd(), config['DIRS']['DEV-ASSETS-DIR'])


os.makedirs(app.config['UPLOAD-DIR'], exist_ok=True)
os.makedirs(app.config['RESULT-DIR'], exist_ok=True)
os.makedirs(app.config['DEV-ASSETS-DIR'], exist_ok=True)

db = DatabaseService(os.path.join(os.getcwd(), config['DATABASE-PATH']))
db.create_tables()

@app.route('/sitemap')
def get_sitemap():
    return dump_url_map(app.url_map)

@app.route('/docs')
def show_docs():
    return send_file('./dev-assets/docs.pdf')

# @app.route('/cookie-check')
# def cookie_check():
#     resp, status = dict(message="done"), 200
#     resp = make_response(resp, status)
#     resp.set_cookie("sessions", json.dumps([{"id": "1", "name": "2022-23"}]), max_age=60*60, path='/')
#     return resp

# CREATE CONTROLLERS
user_controller = UserController(db)
hod_controller = HodController(db)
student_controller = StudentController(db)
meta_controller = MetaController(db)

# CREATE ROUTES
user_router = UserRoute(user_controller, app.config)
hod_router = HodRoute(hod_controller, app.config)
student_router = StudentRoute(student_controller, app.config)
meta_router = MetaRoute(meta_controller, app.config)

routes = [
    user_router,
    hod_router,
    student_router,
    meta_router
]

# REGISTER ROUTES
for route in routes:
    app.register_blueprint(route.get_router(), url_prefix=f'/api/v1/{route.name}')

if __name__ == '__main__':
    app.run(debug=config['DEVELOPMENT'])