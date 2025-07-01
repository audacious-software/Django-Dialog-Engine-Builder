# pylint: disable=no-name-in-module, line-too-long, wrong-import-position

import sys

if sys.version_info[0] > 2:
    from django.urls import re_path as url # pylint: disable=no-name-in-module
else:
    from django.conf.urls import url

from .views import builder_add_dialog, builder_dialog_definition_json, builder_dialog, \
                   builder_interaction_card, builder_dialog_html_view, builder_embeddable_dialogs_json, \
                   builder_active_dialogs_json, dashboard_dialog_scripts, dashboard_dialog_delete, \
                   dashboard_dialog_create, dashboard_dialog_start

urlpatterns = [
    url(r'^add-dialog$', builder_add_dialog, name='builder_add_dialog'),
    url(r'^dashboard/scripts$', dashboard_dialog_scripts, name='dashboard_dialog_scripts'),
    url(r'^dashboard/delete$', dashboard_dialog_delete, name='dashboard_dialog_delete'),
    url(r'^dashboard/create$', dashboard_dialog_create, name='dashboard_dialog_create'),
    url(r'^dashboard/start$', dashboard_dialog_start, name='dashboard_dialog_start'),
    url(r'^card/(?P<card>.+)', builder_interaction_card, name='builder_interaction_card'),
    url(r'^dialog/(?P<dialog>.+).json$', builder_dialog_definition_json, name='builder_dialog_definition_json'),
    url(r'^dialog/(?P<dialog>.+).html$', builder_dialog_html_view, name='builder_dialog_html_view'),
    url(r'^dialog/(?P<dialog>.+)', builder_dialog, name='builder_dialog'),
    url(r'^embeddable-dialogs.json', builder_embeddable_dialogs_json, name='builder_embeddable_dialogs'),
    url(r'^active-dialogs.json', builder_active_dialogs_json, name='builder_active_dialogs'),
]
