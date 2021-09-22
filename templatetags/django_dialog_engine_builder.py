import json

from django import template

register = template.Library()

@register.filter
def cytoscape_json(dialog):
    elements = []

    dialog_machine = dialog.dialog_machine()

    for node in dialog_machine.nodes():
        element = {
            'data': {
                'id': node.node_id,
                'name': node.node_name,
                'dde_node_type': node.node_type(),
            },
            'group': 'nodes'
        }

        elements.append(element)

        for next_node in node.next_nodes():
            if dialog_machine.fetch_node(next_node[0]) is not None:
                edge = {
                    'data': {
                        'id': node.node_id + '__' + next_node[0],
                        'source': node.node_id,
                        'target': next_node[0],
                        'isdirected': True,
                        'dde_edge_description': next_node[1],
                    },
                    'group': 'edges'
                }

                elements.append(edge)

    return json.dumps(elements, indent=2)
