from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
class User(AbstractUser):
    groups = models.ManyToManyField(settings.AUTH_GROUP_MODEL)
