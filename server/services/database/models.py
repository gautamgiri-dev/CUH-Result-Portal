from easyql.model import Model
from typing import Any
import os

class UserModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/users.json'
        super().__init__(payload, schema)

class SchoolModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/schools.json'
        super().__init__(payload, schema)

class RoleModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/roles.json'
        super().__init__(payload, schema)

class DepartmentModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/departments.json'
        super().__init__(payload, schema)

class ExternalModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/externals.json'
        super().__init__(payload, schema)

class InternalHistoryModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/internals_history.json'
        super().__init__(payload, schema)

class InternalModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/internals.json'
        super().__init__(payload, schema)

class ProgrammeModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/programmes.json'
        super().__init__(payload, schema)

class SubjectModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/subjects.json'
        super().__init__(payload, schema)

class SessionModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/sessions.json'
        super().__init__(payload, schema)

class StatusModel(Model):
    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        schema = './services/database/schemas/status.json'
        super().__init__(payload, schema)
