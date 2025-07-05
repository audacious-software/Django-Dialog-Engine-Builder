# pylint: disable=no-member, line-too-long
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from builtins import str # pylint: disable=redefined-builtin

import importlib
import json
import os

from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Q
from django.http import HttpResponse, FileResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.utils import timezone
from django.utils.html import mark_safe
from django.utils.text import slugify
from django.views.decorators.cache import never_cache
from django.views.decorators.clickjacking import xframe_options_sameorigin

from django_dialog_engine.models import DialogScript

from .models import InteractionCard

@never_cache
@staff_member_required
def builder_dialog(request, dialog): # pylint: disable=unused-argument
    context = {}

    context['dialog'] = DialogScript.objects.filter(pk=str(dialog)).first()

    card_modules = []
    card_types = []

    for card in InteractionCard.objects.filter(enabled=True).order_by('name'):
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

@never_cache
@staff_member_required
def builder_dialog_definition_json(request, dialog): # pylint: disable=unused-argument
    dialog_script = DialogScript.objects.filter(pk=str(dialog)).first()

    return HttpResponse(json.dumps(dialog_script.definition, indent=2), content_type='application/json', status=200)

@never_cache
@staff_member_required
def builder_embeddable_dialogs_json(request): # pylint: disable=unused-argument
    dialogs_json = []

    for script in DialogScript.objects.filter(embeddable=True).exclude(identifier=None):
        dialogs_json.append({
            'id': script.identifier,
            'name': script.name
        })

    return HttpResponse(json.dumps(dialogs_json, indent=2), content_type='application/json', status=200)

@never_cache
@staff_member_required
def builder_active_dialogs_json(request): # pylint: disable=unused-argument
    dialogs_json = []

    for script in DialogScript.objects.exclude(identifier=None).order_by('name'):
        if script.is_active():
            dialogs_json.append({
                'id': script.identifier,
                'name': script.name
            })

    return HttpResponse(json.dumps(dialogs_json, indent=2), content_type='application/json', status=200)

@never_cache
def builder_interaction_card(request, card): # pylint: disable=unused-argument
    card = get_object_or_404(InteractionCard, identifier=card)

    content_type = 'application/javascript'

    implementation_path = os.path.join(settings.STATIC_ROOT, 'builder-js/js/cards/' + card.identifier + '.js')

    response = FileResponse(open(implementation_path, 'rb'), content_type=content_type) # pylint: disable=consider-using-with
    response['Content-Length'] = os.path.getsize(implementation_path)

    return response

@staff_member_required
@never_cache
def builder_add_dialog(request): # pylint: disable=unused-argument
    dialog = DialogScript(name='New Dialog', created=timezone.now())

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

@xframe_options_sameorigin
@never_cache
def builder_dialog_html_view(request, dialog): # pylint: disable=unused-argument
    context = {
        'dialog': get_object_or_404(DialogScript, pk=int(dialog))
    }

    response = render(request, 'builder_view_min.html', context=context)
    response['X-Frame-Options'] = 'SAMEORIGIN'

    return response

@staff_member_required
def dashboard_dialog_scripts(request):
    context = {
        'include_search': True
    }

    offset = int(request.GET.get('offset', '0'))
    limit = int(request.GET.get('limit', '25'))
    query = request.GET.get('q', None)
    label = request.GET.get('label', None)

    dialog_objects = DialogScript.objects.all()

    if (query in (None, '')) is False:
        search_query = Q(name__icontains=query) | Q(identifier__icontains=query) # pylint: disable=unsupported-binary-operation
        search_query = search_query | Q(labels__icontains=query) | Q(definition__icontains=query) # pylint: disable=unsupported-binary-operation

        dialog_objects = DialogScript.objects.filter(search_query)

    if (label in (None, '')) is False:
        label_query = Q(labels=label) | Q(labels__startswith='%s\n' % label) | Q(labels__contains=('\n%s\n' % label)) |  Q(labels__endswith='\n%s' % label) # pylint: disable=unsupported-binary-operation, superfluous-parens
        label_query = label_query | Q(labels__contains=('|%s\n' % label)) | Q(labels__endswith='|%s' % label) # pylint: disable=unsupported-binary-operation,

        dialog_objects = dialog_objects.filter(label_query)

    total = dialog_objects.count()

    context['dialogs'] = dialog_objects.order_by('name')[offset:(offset + limit)]
    context['total'] = total
    context['start'] = offset + 1
    context['end'] = offset + limit

    if context['end'] > total:
        context['end'] = total

    if (offset - limit) >= 0:
        context['previous'] = '%s?offset=%s&limit=%s' % (reverse('dashboard_dialog_scripts'), offset - limit, limit)

    if (offset + limit) < total:
        context['next'] = '%s?offset=%s&limit=%s' % (reverse('dashboard_dialog_scripts'), offset + limit, limit)

    context['first'] = '%s?offset=0&limit=%s' % (reverse('dashboard_dialog_scripts'), limit)

    last = int(total / limit) * limit

    context['last'] = '%s?offset=%s&limit=%s' % (reverse('dashboard_dialog_scripts'), last, limit)

    all_labels = []

    for script in DialogScript.objects.all():
        for label in script.labels_list():
            cleaned_label = label.split('|')[-1]

            if (cleaned_label in all_labels) is False:
                all_labels.append(cleaned_label)

    all_labels.sort()

    context['labels'] = all_labels

    return render(request, 'dashboard/dashboard_dialog_scripts.html', context=context)

@staff_member_required
def dashboard_dialog_create(request):
    identifier = request.POST.get('identifier', None)
    name = request.POST.get('name', None)

    if None in (name, identifier):
        payload = {
            'message': 'Unable to create dialog script.'
        }
    else:
        script = DialogScript.objects.filter(identifier=identifier).first()

        if script is None:
            payload = {
                'message': 'Unable to locate dialog script to copy (%s).' % identifier
            }
        else:
            new_id = slugify(name)

            index = 1

            while DialogScript.objects.filter(identifier=new_id).count() > 0:
                new_id = slugify('%s %s' % (name, index))

            script.pk = None
            script.name = name
            script.identifier = new_id

            script.save()

            payload = {
                'message': 'New dialog script created.'
            }

    return HttpResponse(json.dumps(payload, indent=2), content_type='application/json', status=200)

@staff_member_required
def dashboard_dialog_delete(request):
    identifier = request.POST.get('identifier', None)

    deleted = DialogScript.objects.filter(identifier=identifier).delete()

    payload = {
        'message': '%s dialog script(s) deleted.' % deleted[0]
    }

    return HttpResponse(json.dumps(payload, indent=2), content_type='application/json', status=200)

@staff_member_required
def dashboard_dialog_start(request):
    payload = {
        'message': 'Unable to launch dialog.'
    }

    if request.method == 'POST':
        identifier = request.POST.get('identifier', None)
        destination = request.POST.get('destination', None)

        interrupt_seconds = request.POST.get('interrupt_seconds', None)
        pause_seconds = request.POST.get('pause_seconds', None)
        timeout_seconds = request.POST.get('timeout_seconds', None)
        dialog_variables = request.POST.get('dialog_variables', '').split('\n')

        dialog_options = {}

        if interrupt_seconds is not None and interrupt_seconds != '':
            dialog_options['interrupt_minutes'] = float(interrupt_seconds) / 60

        if pause_seconds is not None and pause_seconds != '':
            dialog_options['pause_minutes'] = float(pause_seconds) / 60

        if timeout_seconds is not None and timeout_seconds != '':
            dialog_options['timeout_minutes'] = float(timeout_seconds) / 60

        for variable in dialog_variables:
            pair = variable.split('=')

            if len(pair) > 1:
                dialog_options[pair[0].strip()] = pair[1].strip()

        started = False

        for app in settings.INSTALLED_APPS:
            try:
                dialog_module = importlib.import_module('.dialog_api', package=app)

                if dialog_module.launch_dialog_script(identifier, destination, dialog_options):
                    started = True

                    break
            except ImportError:
                pass
            except AttributeError:
                pass

        if started:
            payload = {
                'message': 'Dialog launched.'
            }

    return HttpResponse(json.dumps(payload, indent=2), content_type='application/json', status=200)
