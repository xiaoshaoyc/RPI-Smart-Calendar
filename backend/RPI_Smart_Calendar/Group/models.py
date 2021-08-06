from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group
# The MyGroup model represents Group of courses
class MyGroup(Group):
    # it represents id of the course
    group_id = models.CharField(max_length=30, null=True,  unique=True)

# The Message model represents a message
class Message(models.Model):
    # group indicates the group of the message
    group = models.ForeignKey(settings.AUTH_GROUP_MODEL, on_delete=models.CASCADE)
    # user indicates who sent the message
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, default='')
    # text indicates what was sent
    text = models.CharField(max_length=240)
    # time indicates when the message was sent
    time = models.DateTimeField(auto_now_add=True)
    # the displayed name of the model is text
    def __str__(self):
        return self.text