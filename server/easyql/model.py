from typing import Any, Self
from .field import Field
from .types import Types
import os
import json

class Model:
    def __init__(self, payload: dict[str, Any] | None = None, schema: list[dict[str, str]] | os.PathLike | str = None) -> None:
        self.id = None
        self.fields: dict[str, Field] = {}
        if schema:
            self.load_from_schema(schema)

        if payload:
            self.parse_from_payload(payload)

    def parse_from_payload(self, payload: dict[str, Any]) -> None:
        if payload:
            for key, value in payload.items():
                self.__setattr__(key, value)

    def get_field_type(self, ftype: str) -> Types:
        types = {
            'INT': Types.INTEGER,
            'TEXT': Types.STRING,
            'REAL': Types.FLOAT
        }

        return types[ftype.upper()]

    def load_from_schema(self, schema: list[dict[str, str]] | os.PathLike | str = None) -> None:
        if os.path.isfile(schema):
            schema = json.load(open(schema, 'r', encoding='utf-8'))
        elif isinstance(schema, str):
            schema = json.loads(schema)

        requireds = []
        uniques = []
        defaults = {}

        for field in schema:
            self.__setattr__(field['name'], self.get_field_type(field['type']))
            if 'required' in field and field['required']:
                requireds.append(field['name'])

            if 'unique' in field and field['unique']:
                uniques.append(field['name'])

            if 'default' in field:
                defaults[field['name']] = field['default']

        self.set_required(requireds)
        self.set_unique(uniques)
        self.set_defaults(defaults)

    def set_unique(self, fields: list[str]) -> None:
        for field in fields:
            self.fields[f'_{field}'].set_unique(True)

    def set_required(self, fields: list[str]) -> None:
        for field in fields:
            self.fields[f'_{field}'].set_required(True)

    def set_defaults(self, values: dict[str, Any]) -> None:
        for key, value in values.items():
            self.fields[f'_{key}'].set_default(value)

    def set_primary_key(self, name: str):
        self.fields[f'_{name}'].set_primary_key()

    def set_auto_increment(self, name: str):
        self.fields[f'_{name}'].set_auto_increment()

    def get_item(self, name):
        return self.fields[f'_{name}']
    
    def set_values(self, row : list) -> Self:
        self.id = row[0]
        row = row[1:]
        for i, key in enumerate(self.fields.keys()):
            self.fields[key].value = row[i]

    def __getattr__(self, __name: str) -> Any:
        return self.fields[f'_{__name}'].value

    def __setattr__(self, __name: str, __value: Types | Any) -> None:
        if __name in ['id', 'parse_from_payload', 'fields']:
            super().__setattr__(__name, __value)
            return

        if f'_{__name}' in self.fields and not isinstance(__value, Types):
            field_type = self.fields[f'_{__name}'].field_type

            if isinstance(__value, dict):
                self.fields[f'_{__name}'].value = __value
                return

            if field_type == Types.INTEGER:
                __value = int(__value)
            elif field_type == Types.FLOAT:
                __value = float(__value)
            else:
                __value = str(__value)
            self.fields[f'_{__name}'].value = __value
            return
        
        field = Field(__name, __value)
        self.fields[f'_{__name}'] = field

    def get_field_names(self) -> list[str]:
        field_names = ['id']
        field_names.extend([f'"{name[1:]}"' for name in self.fields.keys()])

        return field_names

    def get_fields(self) -> list[Field]:
        return list(self.fields.values())
    
    def to_dict(self):
        payload = {'id': self.id}
        for key, field in self.fields.items():
            payload[key[1:]] = field.value

        return payload