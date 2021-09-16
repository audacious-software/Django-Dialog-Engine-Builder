# pylint: disable=line-too-long

from django.conf.urls import url

from .views import builder_add_dialog, builder_dialog_definition_json, builder_dialog, \
                   builder_interaction_card, builder_dialog_html_view

urlpatterns = [
    url(r'^add-dialog$', builder_add_dialog, name='builder_add_dialog'),
    url(r'^card/(?P<card>.+)', builder_interaction_card, name='builder_interaction_card'),
    url(r'^dialog/(?P<dialog>.+).json$', builder_dialog_definition_json, name='builder_dialog_definition_json'),
    url(r'^dialog/(?P<dialog>.+).html$', builder_dialog_html_view, name='builder_dialog_html_view'),
    url(r'^dialog/(?P<dialog>.+)', builder_dialog, name='builder_dialog'),
]
