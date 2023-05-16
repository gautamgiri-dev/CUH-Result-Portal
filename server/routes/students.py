from controllers.students import StudentController
from flask import request, make_response, Config, send_from_directory

from werkzeug.utils import secure_filename

from .route import Route
from typing import Any
import os

class StudentRoute(Route):
    def __init__(self, controller: StudentController, config: Config) -> None:
        super().__init__('students', 'students', config)
        self.controller = controller

        self.get('/download-result/<filename>', self.download_result)
        self.post('/get-result', self.get_result)

    def get_result(self):
        resp, status = self.controller.get_result(request.json, self.config['RESULT-DIR'], self.config['DEV-ASSETS-DIR'])
        return make_response(resp, status)
    
    def download_result(self, filename):
        # resp = make_response(dict(message="Result downloaded!"), 200)
        
        return send_from_directory(directory=self.config['RESULT-DIR'], path=secure_filename(filename), as_attachment=True)