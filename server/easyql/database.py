import sqlite3
from .table import Table

class Database:
    def __init__(self, path) -> None:
        self.path = path
        self.con = sqlite3.connect(self.path, check_same_thread=False)
        self.tables : dict[str, Table] = {}

    def create_tables(self):
        print('Creating Database Tables')
        for _, table in self.tables.items():
            table.create()
            print(f'{table.name} table created successfully!')

    def __getattr__(self, __name: str) -> Table:
        return self.tables[f'_{__name}']

    def __setattr__(self, __name: str, __value: Table) -> None:
        if isinstance(__value, Table):
            __value.con = self.con
            self.tables[f'_{__name}'] = __value
        else:
            super().__setattr__(__name, __value)

    def dispose(self):
        try:
            self.con.close()
        except Exception as e:
            print('[Closing Connection]', 'An exception occurred while closing the connection', e)