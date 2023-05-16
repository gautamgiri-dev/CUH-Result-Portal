from controllers.users import UserController
from flask import request, make_response, Config

from .route import Route

class UserRoute(Route):
    def __init__(self, controller: UserController, config: Config) -> None:
        super().__init__('users', 'users', config)
        self.controller = controller

        self.get('/get-all', self.get_all)

        self.post('/register', self.register)
        self.post('/login', self.login)

    def register(self):
        resp, status = self.controller.register(request.json)
        return make_response(resp, status)

    def login(self):
        resp, status = self.controller.login(request.json)
        return make_response(resp, status)
    
    def get_all(self):
        resp, status = self.controller.get_all()
        return make_response(resp, status)