# pylint: disable=no-name-in-module, line-too-long

import sys

from .views import builder_add_dialog, builder_dialog_definition_json, builder_dialog, \
                   builder_interaction_card, builder_dialog_html_view, builder_embeddable_dialogs_json, \
                   builder_active_dialogs_json

if sys.version_info[0] > 2:
    from django.urls import re_path

    urlpatterns = [
        re_path(r'^add-dialog$', builder_add_dialog, name='builder_add_dialog'),
        re_path(r'^card/(?P<card>.+)', builder_interaction_card, name='builder_interaction_card'),
        re_path(r'^dialog/(?P<dialog>.+).json$', builder_dialog_definition_json, name='builder_dialog_definition_json'),
        re_path(r'^dialog/(?P<dialog>.+).html$', builder_dialog_html_view, name='builder_dialog_html_view'),
        re_path(r'^dialog/(?P<dialog>.+)', builder_dialog, name='builder_dialog'),
        re_path(r'^embeddable-dialogs.json', builder_embeddable_dialogs_json, name='builder_embeddable_dialogs'),
        re_path(r'^active-dialogs.json', builder_active_dialogs_json, name='builder_active_dialogs'),
    ]
else:
    from django.conf.urls import url

    urlpatterns = [
        url(r'^add-dialog$', builder_add_dialog, name='builder_add_dialog'),
        url(r'^card/(?P<card>.+)', builder_interaction_card, name='builder_interaction_card'),
        url(r'^dialog/(?P<dialog>.+).json$', builder_dialog_definition_json, name='builder_dialog_definition_json'),
        url(r'^dialog/(?P<dialog>.+).html$', builder_dialog_html_view, name='builder_dialog_html_view'),
        url(r'^dialog/(?P<dialog>.+)', builder_dialog, name='builder_dialog'),
        url(r'^embeddable-dialogs.json', builder_embeddable_dialogs_json, name='builder_embeddable_dialogs'),
        url(r'^active-dialogs.json', builder_active_dialogs_json, name='builder_active_dialogs'),
    ]
