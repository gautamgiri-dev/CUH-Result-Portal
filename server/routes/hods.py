from controllers.hods import HodController
from flask import request, make_response, Config

from .route import Route

from typing import Any

class HodRoute(Route):
    def __init__(self, controller: HodController, config: Config) -> None:
        super().__init__('hods', 'hods', config)
        self.controller = controller

        self.post('/create-subjects', self.create_subjects)
        self.get('/download-format', self.download_format)
        self.post('/upload-internal-awards', self.upload_internal_awards)

    def create_subjects(self):
        resp, status = self.controller.create_subjects(request.json)
        return make_response(resp, status)
    
    def download_format(self):
        data, filename, status = self.controller.download_format(request.args)

        resp = make_response(data, status)
        resp.headers["Content-Disposition"] = f"attachment; filename={filename}.csv"
        resp.headers["Content-Type"] = "text/csv"

        return resp
    
    def upload_internal_awards(self):
        resp, status = self.controller.upload_internal_awards(dict(request.form), request.files['file'], self.config['UPLOAD-DIR'])

        return make_response(resp, status)
