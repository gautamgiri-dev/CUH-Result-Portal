from controllers.meta import MetaController
from flask import request, make_response, Config
from .route import Route
from typing import Any

class MetaRoute(Route):
    def __init__(self, controller: MetaController, config: Config) -> None:
        super().__init__('meta', 'meta', config)
        self.controller = controller
        self.get('/get-metadata', self.get_meta)

    def get_meta(self):
        resp, status = self.controller.get_meta()
        return make_response(resp, status)