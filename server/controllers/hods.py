from easyql.payload import Filter, Update, PopulateQuery
from services.database.database_service import DatabaseService
from services.database.models import UserModel, ProgrammeModel, SubjectModel
from services.database.models import InternalHistoryModel, InternalModel
from .controller import Controller
from routes.status import StatusCode

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

import pandas as pd
import os
import uuid
# from threading import Thread

from typing import Any

class HodController(Controller):
    def __init__(self, db: DatabaseService) -> None:
        self.db = db
        self.programmeTable = db.programmeTable
        self.internalHistoryTable = db.internalHistoryTable
        self.subjectTable = db.subjectTable
        self.internalTable = db.internalTable

    def create_subjects(self, body: dict[str, Any]) -> tuple[dict[str, Any], int]:
        payload = self.get_payload_from_body(body, 'session', 'semester', 'names', 'codes', 'department', 'programme')

        subjects = SubjectModel(payload)
        self.subjectTable.insert(subjects)

        return dict(
            message='Subjects created successfully!',
            subjects=subjects.to_dict() or {}
        ), StatusCode.OK.value
    
    def download_format(self, query: dict[str, Any]) -> tuple[str, str, int]:
        session = query['session']
        semester = query['semester']
        programme = query['programme']

        filter = Filter(session=session, semester=semester, programme=programme)

        populate = PopulateQuery()
        populate.add('programme', self.db.programmeTable)

        subjects = self.subjectTable.get(filter, populate, 1)

        subjects = subjects[0] if subjects else None

        codes = subjects.codes.split(',')
        
        headers = ['Roll No', 'Name']
        headers.extend(codes)

        filename = f'{subjects.programme["name"]}-sem-{semester}-format'

        df = pd.DataFrame(columns=headers)

        return df.to_csv(index_label='S.No.'), filename, StatusCode.OK.value
    
    def upload_internal_awards(self, form: dict[str, Any], file: FileStorage, upload_folder: str) -> tuple[dict[str, Any], int]:
        
        filename = os.path.join(upload_folder, secure_filename(uuid.uuid4().hex))

        file.save(filename)

        history_payload = self.get_payload_from_body(form, 'name', 'hod', 'programme', 'session', 'semester', 'uploadedOn')
        history_model = InternalHistoryModel(history_payload)

        self.internalHistoryTable.insert(history_model)

        filter = Filter(hod=history_model.hod, programme=history_model.programme,
                        session=history_model.session, semester=history_model.semester)

        upload_id = self.internalHistoryTable.get_id(filter)

        df = pd.read_csv(filename, index_col=0, header=0)

        student_details = df.iloc[:, :2].values.tolist()
        marks_details = df.iloc[:, 2:].values.tolist()

        for i in range(len(student_details)):
            payload = {
                "uploadId": upload_id,
                "roll": student_details[i][0],
                "student_name": student_details[i][1],
                "marks": ",".join([str(x) for x in marks_details[i]])
            }
            internal_model = InternalModel(payload)

            self.internalTable.insert(internal_model)

        return dict(
            message="Internal Awards Uploaded Successfully!",
            upload_id=upload_id,
            num_students=len(student_details)
        ), 200



        

