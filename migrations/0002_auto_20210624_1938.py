# pylint: skip-file
# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-06-25 00:38
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_dialog_engine_builder', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='interactioncard',
            name='client_implementation',
        ),
        migrations.RemoveField(
            model_name='interactioncard',
            name='entry_actions',
        ),
        migrations.RemoveField(
            model_name='interactioncard',
            name='evaluate_function',
        ),
    ]
