from .field import Field
from typing import Self

class Payload:
    def __init__(self, fields: list[str], values: list) -> None:
        self.fields = fields
        self.values = values

    def __repr__(self) -> str:
        return self.__str__()

    def __str__(self, separator) -> str:
        return f' {separator} '.join([f'"{field}"=?' for field in self.fields])
    
    def get_values(self) -> list:
        return list(self.values)
    
class Filter(Payload):
    def __init__(self, **filters) -> None:
        super().__init__(filters.keys(), filters.values())
        self.is_query = False

    def __str__(self) -> str:
        return super().__str__('AND')
    
class Update(Payload):
    def __init__(self, **updates) -> None:
        super().__init__(updates.keys(), updates.values())

    def __str__(self) -> str:
        return super().__str__(',')
    
# class Populate:
#     def __init__(self, **populations) -> None:
#         self.fields = list(populations.keys())
#         self.sources = list(populations.values())

# class Populate:
#     def __init__(self, field: str, ) -> None:
#         pass

class PopulateQuery:
    def __init__(self) -> None:
        self.populations: list[dict] = []
        self.count = 0

    def add(self, field: str, table, rec_population: Self | None = None):
        self.populations.append(
            dict(
                field=field,
                table=table,
                rec_population=rec_population
            )
        )

        self.count += 1

        return self
