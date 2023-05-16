from services.database.database_service import DatabaseService
from .controller import Controller
from routes.status import StatusCode
from easyql.payload import Filter, PopulateQuery

from flask import Response

from services.marksheet.marksheet import generate_pdf

from typing import Any

class StudentController(Controller):
    def __init__(self, db: DatabaseService) -> None:
        self.db = db
        self.internalHistoryTable = db.internalHistoryTable
        self.internalTable = db.internalTable
        self.departmentTable = db.departmentTable
        self.programmeTable = db.programmeTable
        self.subjectTable = db.subjectTable
        self.sessionTable = db.sessionTable

    def get_result(self, body: dict[str, Any], output_path: str, assets_path: str) -> tuple[dict[str, Any], int]:
        roll, department = body['roll'], body['department']
        programme, session, semester = body['programme'], body['session'], body['semester']

        filter = f'''"uploadId" IN 
                    (SELECT id FROM "{self.internalHistoryTable.name}"
                        WHERE "programme"={programme} AND "session"={session} AND "semester"={semester})
                    AND "roll"={roll}'''
        
        populate = PopulateQuery()

        upload_populate = PopulateQuery()

        department_populate = PopulateQuery()
        department_populate.add("department", self.departmentTable)

        upload_populate.add("programme", self.programmeTable, department_populate)
        upload_populate.add("session", self.sessionTable)

        populate.add("uploadId", self.internalHistoryTable, upload_populate)

        result = self.internalTable.get(filter, populate, 1)

        result = result[0].to_dict() if result else None

        message = 'Marks fetched' if result else 'No data found'

        filename = None

        if result:
            filter = Filter(programme=programme, session=session, department=department, semester=semester)
            subject = self.subjectTable.get(filter, None, 1)
            subject = subject[0].to_dict()

            subject = {
                'names': subject['names'].split(','),
                'codes': subject['codes'].split(',')
            }

            result['subject'] = subject

            result['marks'] = result['marks'].split(',')

            filename = generate_pdf(result, output_path, assets_path)


        return dict(
            message=message,
            result=f'/api/v1/students/download-result/{filename}' if filename else None
        ), StatusCode.OK.value