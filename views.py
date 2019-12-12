# pylint: disable=no-member, line-too-long
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import os

from django.http import HttpResponse, Http404, FileResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.utils import timezone
from django.utils.html import mark_safe
from django.utils.text import slugify

from django.contrib.admin.views.decorators import staff_member_required

from django_dialog_engine.models import DialogScript

from .models import InteractionCard

@staff_member_required
def builder_dialog(request, dialog): # pylint: disable=unused-argument
    context = {}

    context['dialog'] = DialogScript.objects.filter(pk=str(dialog)).first()
    
    card_modules = []

    for card in InteractionCard.objects.filter(enabled=True):
        card_modules.append(reverse('builder_interaction_card', args=[card.identifier]))

    context['card_modules_json'] = mark_safe(json.dumps(card_modules)) # nosec

    if request.method == 'POST':
        if 'definition' in request.POST:
            definition = json.loads(request.POST['definition'])

            context['dialog'].definition = definition
        
        if 'name' in request.POST:
            context['dialog'].name = request.POST['name']

        context['dialog'].save()

        return HttpResponse(json.dumps({'success': True}, indent=2), content_type='application/json', status=200)

    return render(request, 'builder_js.html', context=context)

@staff_member_required
def builder_dialog_definition_json(request, dialog): # pylint: disable=unused-argument
    dialog_script = DialogScript.objects.filter(pk=str(dialog)).first()

    return HttpResponse(json.dumps(dialog_script.definition, indent=2), content_type='application/json', status=200)

def builder_interaction_card(request, card): # pylint: disable=unused-argument
    card = get_object_or_404(InteractionCard, identifier=card)

    if card.client_implementation is not None:
        content_type = 'application/octet-stream'

        if card.client_implementation.path.endswith('.js'):
            content_type = 'application/javascript'

        response = FileResponse(open(card.client_implementation.path, 'rb'), content_type=content_type)
        response['Content-Length'] = os.path.getsize(card.client_implementation.path)

        return response

    raise Http404('Card implementation not found. Verify that a client implementation file is attached to the card definition.')

@staff_member_required
def builder_add_dialog(request): # pylint: disable=unused-argument
    dialog = DialogScript(name='New SMS EMA', created=timezone.now())
    
    dialog.definition = [{
        "next_id": "echo-1",
        "type": "begin",
        "id": "dialog-start"
    }, {
        "message": "Hello World.",
        "type": "echo",
        "id": "echo-1",
        "next_id": "prompt-1"
    }, {
        "prompt": "Tell me something interesting.",
        "no_match": "prompt-1",
        "actions": [{
        	"pattern": ".*",
        	"action": "echo-2"
        }],
        "type": "branch-prompt",
        "id": "prompt-1"
    }, {
        "message": "Thanks for that.",
        "type": "echo",
        "id": "echo-2",
        "next_id": "dialog-end"
    }, {
        "type": "end",
        "id": "dialog-end"
    }]          

    dialog.save()
    
    return redirect('builder_dialog', dialog.pk)
