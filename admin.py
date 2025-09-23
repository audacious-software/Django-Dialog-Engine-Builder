# -*- coding: utf-8 -*-

from django.contrib import admin

from .models import InteractionCard

@admin.register(InteractionCard)
class InteractionCardAdmin(admin.ModelAdmin):
    list_display = ('name', 'identifier', 'enabled',)
