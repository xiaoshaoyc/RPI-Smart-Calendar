from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group
# Create your models here.
class MyGroup(Group):
    group_id = models.CharField(max_length=30, null=True,  unique=True)


class Message(models.Model):
    group = models.ForeignKey(settings.AUTH_GROUP_MODEL, on_delete=models.CASCADE, default='')
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, default='')
    text = models.CharField(max_length=240)
    time = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.text