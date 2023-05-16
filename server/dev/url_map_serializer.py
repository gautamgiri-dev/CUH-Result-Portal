from werkzeug.routing import UnicodeConverter

def _rule_to_js(rule):
    # we skip UnicodeConverter since it never needs custom JS code
    return {
        'args': sorted(rule.arguments),
        'defaults': rule.defaults,
        'trace': [{'isDynamic': is_dynamic, 'data': data}
                  for is_dynamic, data in rule._trace],
        'converters': {key: type(converter).__name__
                       for key, converter in rule._converters.items()
                       if type(converter) is not UnicodeConverter}
    }


def dump_url_rule(url_map, endpoint):
    """Dump the URL rules for the given endpoint to a dict"""
    return {
        'endpoint': endpoint,
        'rules': [_rule_to_js(rule) for rule in url_map.iter_rules(endpoint)]
    }


def dump_url_map(url_map):
    """Dump all URL rules of the given URL map to a dict"""
    return {endpoint: dump_url_rule(url_map, endpoint)
            for endpoint in url_map._rules_by_endpoint}