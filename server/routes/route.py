from flask import Blueprint, Config
from controllers.controller import Controller

class Route:
    def __init__(self, name: str, import_name: str, config: Config) -> None:
        self.name = name
        self.config = config
        self.blueprint = Blueprint(name, import_name=import_name)

    def __add_rule(self, route: str, view_func, methods: list[str]) -> None:
        self.blueprint.add_url_rule(rule=route, view_func=view_func, methods=methods)

    def get(self, route: str, view_func) -> None:
        self.__add_rule(route=route, view_func=view_func, methods=['GET'])

    def post(self, route: str, view_func) -> None:
        self.__add_rule(route=route, view_func=view_func, methods=['POST'])

    def get_router(self) -> Blueprint:
        return self.blueprint