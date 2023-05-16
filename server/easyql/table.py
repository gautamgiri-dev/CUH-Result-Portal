from sqlite3 import Connection, Cursor
from .payload import Filter, Update, PopulateQuery
from .model import Model

class Table:
    def __init__(self, name: str, model) -> None:
        self.model = model
        self.name = name
        self.fields = self.model().get_fields()
        self.con: Connection = None

    def execute(self, query: str, payload: list = [], commit: bool = False, ret_cur: bool = False) -> None | Cursor:
        cur = self.con.cursor()
        cur.execute(query, payload)

        if commit:
            self.con.commit()

        if ret_cur:
            return cur
        
        cur.close()

    def create(self) -> None:
        query = f"""CREATE TABLE IF NOT EXISTS "{self.name}" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            {", ".join([str(field) for field in self.fields])}
        )"""

        self.execute(query, commit=True)
    
    def insert(self, model: Model) -> None:
        fields = [field for field in model.get_fields() if field.value]

        field_names = ', '.join([f'"{x.name}"' for x in fields])

        query = f"INSERT INTO {self.name} ({field_names}) VALUES ({','.join(['?' for i in range(len(fields))])})"

        payload = [field.value for field in fields]

        self.execute(query, payload, commit=True)

    def update(self, condition: Filter, update: Update) -> None:
        query = f"UPDATE \"{self.name}\" SET ({update})" + (f" WHERE {condition}" if condition else '')
        payload = update.get_values().extend(condition.get_values() if condition else [])

        self.execute(query, payload, commit=True)

    def delete(self, condition: Filter) -> None:
        query = f"DELETE FROM \"{self.name}\" WHERE {condition}"
        self.execute(query, condition.get_values(), True)

    def get_id(self, condition: Filter) -> None:
        query = f"SELECT id FROM \"{self.name}\" WHERE {condition}"

        cur = self.execute(query, condition.get_values(), ret_cur=True)
        row = cur.fetchone()

        cur.close()

        if row:
            return row[0]
        return None

    def get(self, condition : Filter | str | None = None, population: PopulateQuery | None = None, count: int | None = None) -> list[Model]:
        if not condition:
            condition = "\"id\" IS NOT NULL"
        
        rows = self._get(condition, count)
        results: list[Model] = []

        for i in range(len(rows)):
            model: Model = self.model()
            model.set_values(rows[i])

            if population:
                for p in population.populations:
                    pop_cond = Filter(id=model.__getattr__(p['field']))

                    table = p['table']
                    rec_population = p['rec_population']

                    pop_data = table.get(pop_cond, rec_population, 1)[0]
                    pop_data = pop_data.to_dict()
                    model.__setattr__(p['field'], pop_data)

            results.append(model)

        return results

    def _get(self, condition: Filter | str, count : int | None = None) -> list:

        query = f'SELECT {" , ".join(self.model().get_field_names())} FROM \"{self.name}\" WHERE {condition}'

        values = condition.get_values() if isinstance(condition, Filter) else []

        cur = self.execute(query, values, ret_cur=True)
        if count:
            rows = cur.fetchmany(count)
        else:
            rows = cur.fetchall()
        cur.close()
        return rows