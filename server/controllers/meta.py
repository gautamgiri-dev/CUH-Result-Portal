from services.database.database_service import DatabaseService
from .controller import Controller
from routes.status import StatusCode
from easyql.payload import Filter

from typing import Any

class MetaController(Controller):
    def __init__(self, db: DatabaseService) -> None:
        self.db = db
        self.sessionsTable = db.sessionTable
        self.schoolsTable = db.schoolTable
        self.departmentTable = db.departmentTable
        self.programmeTable = db.programmeTable
        self.roleTable = db.roleTable
        self.statusTable = db.statusTable

    def get_meta(self) -> tuple[dict[str, Any], int]:
        sessions = [s.to_dict() for s in self.sessionsTable.get()]
        schools = [s.to_dict() for s in self.schoolsTable.get()]
        departments = [s.to_dict() for s in self.departmentTable.get()]
        programmes = [s.to_dict() for s in self.programmeTable.get()]
        roles = [s.to_dict() for s in self.roleTable.get()]
        statuses = [s.to_dict() for s in self.statusTable.get()]

        return dict(
            message='Meta Data fetched!',
            sessions=sessions,
            schools=schools,
            departments=departments,
            programmes=programmes,
            roles=roles,
            statuses=statuses
        ), 200
