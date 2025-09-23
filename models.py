# pylint: disable=no-member, line-too-long
# -*- coding: utf-8 -*-

from django.db import models

class InteractionCard(models.Model):
    name = models.CharField(max_length=4096, unique=True)
    identifier = models.SlugField(max_length=4096, unique=True)

    description = models.TextField(max_length=16384, null=True, blank=True)

    enabled = models.BooleanField(default=True)

    def __unicode__(self):
        return self.name + ' (' + self.identifier + ')'
