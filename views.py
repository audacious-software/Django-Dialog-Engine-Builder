# pylint: disable=no-member, line-too-long
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from builtins import str # pylint: disable=redefined-builtin
import json
import os

from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponse, FileResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.utils import timezone
from django.utils.html import mark_safe

from django_dialog_engine.models import DialogScript

from .models import InteractionCard

@staff_member_required
def builder_dialog(request, dialog): # pylint: disable=unused-argument
    context = {}

    context['dialog'] = DialogScript.objects.filter(pk=str(dialog)).first()

    card_modules = []
    card_types = []

    for card in InteractionCard.objects.filter(enabled=True):
        card_modules.append(reverse('builder_interaction_card', args=[card.identifier]))
        card_types.append(card.identifier)

    context['card_modules_json'] = mark_safe(json.dumps(card_modules)) # nosec
    context['card_types'] = card_types

    if request.method == 'POST':
        if 'definition' in request.POST:
            definition = json.loads(request.POST['definition'])

            context['dialog'].definition = definition

        if 'name' in request.POST:
            context['dialog'].name = request.POST['name']

        if 'identifier' in request.POST:
            context['dialog'].identifier = request.POST['identifier']

        context['dialog'].save()

        return HttpResponse(json.dumps({'success': True}, indent=2), content_type='application/json', status=200)

    return render(request, 'builder_js.html', context=context)

@staff_member_required
def builder_dialog_definition_json(request, dialog): # pylint: disable=unused-argument
    dialog_script = DialogScript.objects.filter(pk=str(dialog)).first()

    return HttpResponse(json.dumps(dialog_script.definition, indent=2), content_type='application/json', status=200)

@staff_member_required
def builder_embeddable_dialogs_json(request): # pylint: disable=unused-argument
    dialogs_json = []

    for script in DialogScript.objects.filter(embeddable=True).exclude(identifier=None):
        dialogs_json.append({
            'id': script.identifier,
            'name': script.name
        })

    return HttpResponse(json.dumps(dialogs_json, indent=2), content_type='application/json', status=200)

def builder_interaction_card(request, card): # pylint: disable=unused-argument
    card = get_object_or_404(InteractionCard, identifier=card)

    content_type = 'application/javascript'

    implementation_path = os.path.join(settings.STATIC_ROOT, 'builder-js/js/cards/' + card.identifier + '.js')

    response = FileResponse(open(implementation_path, 'rb'), content_type=content_type) # pylint: disable=consider-using-with
    response['Content-Length'] = os.path.getsize(implementation_path)

    return response

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

# @staff_member_required
def builder_dialog_html_view(request, dialog): # pylint: disable=unused-argument
    context = {
        'dialog': DialogScript.objects.filter(pk=str(dialog)).first()
    }

    response = render(request, 'builder_view_min.html', context=context)
    response['X-Frame-Options'] = 'SAMEORIGIN'

    return response
