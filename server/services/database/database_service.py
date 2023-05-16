from easyql.database import Database
from easyql.table import Table
from .models import UserModel, SchoolModel, RoleModel, DepartmentModel, ProgrammeModel
from .models import ExternalModel, InternalHistoryModel, InternalModel, SubjectModel
from .models import SessionModel, StatusModel

class DatabaseService(Database):
    def __init__(self, path) -> None:
        super().__init__(path)

        self.sessionTable = Table(name='sessions', model=SessionModel)
        self.roleTable = Table(name='roles', model=RoleModel)
        self.userTable = Table(name='users', model=UserModel)
        self.schoolTable = Table(name='schools', model=SchoolModel)
        self.departmentTable = Table(name='departments', model=DepartmentModel)
        
        self.externalTable = Table(name='externals', model=ExternalModel)
        self.internalHistoryTable = Table(name='internal_history', model=InternalHistoryModel)
        self.internalTable = Table(name='internals', model=InternalModel)
        self.programmeTable = Table(name='programmes', model=ProgrammeModel)
        self.subjectTable = Table(name='subjects', model=SubjectModel)

        self.statusTable = Table(name='status', model=StatusModel)