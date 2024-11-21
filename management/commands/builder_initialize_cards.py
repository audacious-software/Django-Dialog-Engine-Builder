# pylint: disable=no-member
# -*- coding: utf-8 -*-

from __future__ import print_function

import importlib

from django.conf import settings
from django.core.management.base import BaseCommand

from ...models import InteractionCard

CARDS = (
    ('Start Dialog', 'begin',),
    ('End Dialog', 'end',),
    ('Branching Prompt', 'branch-prompt',),
    ('Send Message', 'echo',),
    ('Loop', 'loop',),
    ('Random Branch', 'random-branch',),
    ('Raise Alert', 'alert',),
    ('Pause', 'pause',),
    ('External Choice', 'external-choice',),
    ('Branching Conditions', 'branch-conditions',),
    ('Interrupt', 'interrupt',),
    ('Interrupt Resume', 'interrupt-resume',),
    ('Time-Elapsed Interrupt', 'time-elapsed-interrupt',),
    ('Embedded Dialog', 'embed-dialog',),
    ('Record Variable', 'record-variable',),
    ('Update Variable', 'update-variable',),
)

class Command(BaseCommand):
    help = 'Initializes the system with provided cards.'

    def handle(self, *args, **options):
        for card in CARDS:
            if InteractionCard.objects.filter(identifier=card[1]).count() == 0:
                InteractionCard.objects.create(name=card[0], identifier=card[1], enabled=True)

                print('Added %s...' % card[0])

    for app in settings.INSTALLED_APPS:
        try:
            dialog_module = importlib.import_module('.dialog_api', package=app)

            cards = dialog_module.dialog_builder_cards()

            for card in cards:
                if InteractionCard.objects.filter(identifier=card[1]).count() == 0:
                    InteractionCard.objects.create(name=card[0], identifier=card[1], enabled=True)

                    print('Added %s from %s...' % (card[0], app))

        except ImportError:
            pass
        except AttributeError:
            pass
