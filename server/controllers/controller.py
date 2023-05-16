from easyql.table import Table
from easyql.payload import Filter, Update, PopulateQuery
from easyql.model import Model

from typing import Any

class Controller:
    def __init__(self, table: Table) -> None:
        self.table = table

    def create(self, model: Model) -> None:
        self.table.insert(model)

    def remove(self, filter: Filter) -> None:
        self.table.delete(filter)

    def get_id(self, filter: Filter) -> int:
        return self.table.get_id(filter)

    def get(self, filter: Filter, population: PopulateQuery | None = None, count: int | None = None) -> list[Model]:
        return self.table.get(condition=filter, population=population, count=count)
    
    def update(self, filter: Filter, update: Update) -> None:
        return self.table.update(filter, update)
    
    def get_payload_from_body(self, body: dict[str, Any], *fields) -> dict[str, Any]:
        payload = dict()
        for field in fields:
            if isinstance(body[field], list):
                body[field] = ','.join(str(x) for x in body[field])

            payload[field] = body[field]

        return payload