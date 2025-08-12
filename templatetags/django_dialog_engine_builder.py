import json
import logging

from django import template
from django.utils.text import slugify

register = template.Library()

@register.filter
def cytoscape_json(dialog):
    logger = logging.getLogger()

    elements = []

    dialog_machine = dialog.dialog_machine()

    group_nodes = []

    for node in dialog_machine.nodes():
        element = {
            'data': {
                'id': node.node_id,
                'name': node.node_name,
                'dde_node_type': node.node_type(),
                'dde_search_text': node.search_text()
            },
            'classes': ['node_' + node.node_type()],
            'group': 'nodes'
        }

        if node.definition is not None:
            if 'builder_group' in node.definition:
                if (node.definition['builder_group'] in group_nodes) is False:
                    group_nodes.append(node.definition['builder_group'])

                element['data']['parent'] = slugify('dde_group_' + node.definition['builder_group'])

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

    for node_group in group_nodes:
        element = {
            'data': {
                'id': slugify('dde_group_' + node_group),
                'name': node_group,
                'dde_node_type': 'group',
            },
            'classes': ['node_group'],
            'group': 'nodes'
        }

        elements.append(element)

    return json.dumps(elements, indent=2)
