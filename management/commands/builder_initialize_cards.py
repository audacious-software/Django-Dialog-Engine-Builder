# pylint: disable=no-member
# -*- coding: utf-8 -*-

from __future__ import print_function

from django.core.management.base import BaseCommand

from ...models import InteractionCard

CARDS = (
    ('Start Dialog', 'begin',),
    ('End Dialog', 'end',),
    ('Branching Prompt', 'branch-prompt',),
    ('Send Message', 'echo',),
)

class Command(BaseCommand):
    help = 'Initializes the system with provided cards.'

    def handle(self, *args, **options):
        for card in CARDS:
            if InteractionCard.objects.filter(identifier=card[1]).count() == 0:
                InteractionCard.objects.create(name=card[0], identifier=card[1], enabled=True)

                print('Added ' + card[0] + '...')
