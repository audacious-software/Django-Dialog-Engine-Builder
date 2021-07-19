# pylint: disable=no-member, line-too-long
# -*- coding: utf-8 -*-

from __future__ import print_function

from django.core.management.base import BaseCommand

from django_dialog_engine.models import DialogScript

TEMPLATE_DIALOG = [{
    'id': 'dialog-start',
    'type': 'begin',
    'next_id': 'echo-1',
    'builder_group': 'Dialog'
}, {
    'id': 'echo-1',
    'name': 'Hello World',
    'type': 'echo',
    'message': 'Hello World',
    'next_id': 'dialog-end',
    'builder_group': 'Dialog'
}, {
    'id': 'dialog-end',
    'type': 'end',
    'builder_group': 'Dialog'
}]

class Command(BaseCommand):
    help = 'Initializes the system with a default dialog template.'

    def handle(self, *args, **options):
        script = DialogScript.objects.filter(identifier='default').first()

        if script is None:
            DialogScript.objects.create(identifier='default', name='Default Dialog Template', definition=TEMPLATE_DIALOG)

            print('Added default "Hello World" dialog.')
