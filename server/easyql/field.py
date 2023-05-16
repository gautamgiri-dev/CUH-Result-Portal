from typing import Any
from .types import Types

class Field:
    def __init__(self, name: str, field_type: Types) -> None:
        self.name = name
        self.field_type = field_type
        self.value = None
        self.props = []

    def set_unique(self, unique: bool) -> None:
        if unique:
            self.props.append('UNIQUE')
    
    def set_default(self, value : Any) -> None:
        if value:
            self.props.append('DEFAULT ' + (f'"{value}"' if not (isinstance(value, int) or isinstance(value, float)) else str(value)))

    def set_required(self, required: bool) -> None:
        if required:
            self.props.append('NOT NULL')

    def set_primary_key(self) -> None:
        self.props.append('PRIMARY KEY')

    def set_auto_increment(self) -> None:
        self.props.append('AUTOINCREMENT')

    def __str__(self) -> str:
        return f'"{self.name}" {self.field_type.value} {" ".join([prop for prop in self.props])}'