# pylint: skip-file
# Generated by Django 3.2.4 on 2021-06-16 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_dialog_engine_builder', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interactioncard',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]