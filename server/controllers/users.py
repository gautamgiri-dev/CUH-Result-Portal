from easyql.payload import Filter, Update, PopulateQuery
from services.database.models import UserModel
from .controller import Controller
from services.database.database_service import DatabaseService
from routes.status import StatusCode

from typing import Any
import string
import random

class UserController(Controller):
    def __init__(self, db: DatabaseService) -> None:
        self.db = db
        super().__init__(db.userTable)

    def __generate_random_password(self, length: int = 6) -> str:
        password = ''
        combinations = string.ascii_letters + string.digits + string.punctuation
        for i in range(length):
            password += random.choice(combinations)

        return password
    
    def get_all(self) -> tuple[dict[str, Any], int]:
        populate = PopulateQuery()
        populate.add('role', self.db.roleTable)

        department_populate = PopulateQuery()
        department_populate.add('school', self.db.schoolTable)
        
        populate.add('department', self.db.departmentTable, department_populate)

        populate.add('status', self.db.statusTable)

        users = self.get(None, populate)

        users = [user.to_dict() for user in users] if users else None

        return dict(
            message="Users fetched!",
            users=users
        ), StatusCode.OK.value
    
    def login(self, body: dict[str, Any]) -> tuple[dict[str, Any], int]:
        email, password = body['email'], body['password']

        filter = Filter(email=email, password=password)

        populate = PopulateQuery()
        populate.add('role', self.db.roleTable)

        department_populate = PopulateQuery()
        department_populate.add('school', self.db.schoolTable)
        
        populate.add('department', self.db.departmentTable, department_populate)

        populate.add('status', self.db.statusTable)

        users = self.get(filter, populate, 1)
        user = users[0] if len(users) else None

        if user:
            user = user.to_dict()
            del user['password']

        return dict(
            message='Authenticated!' if user else 'Invalid Credentials',
            user=user or {}
        ), StatusCode.OK.value


    def register(self, body: dict[str, Any]) -> tuple[dict[str, Any], int]:
        body['password'] = self.__generate_random_password()

        user = UserModel(body)
        self.create(user)

        if user:
            user = user.to_dict()
            # del user['password']

        return dict(
            message=f'User created successfully!',
            user=user or {}
        ), StatusCode.OK.value

