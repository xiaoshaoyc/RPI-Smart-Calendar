from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
# The User model represents each user of the product
class User(AbstractUser):
    # group indicates which groups the user is in
    groups = models.ManyToManyField(settings.AUTH_GROUP_MODEL)
