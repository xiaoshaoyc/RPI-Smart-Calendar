from django.utils.translation import gettext_lazy as _
from django.db import models
from Group.models import Course
import django
from django.conf import settings
# Create your models here.


class Event(models.Model):
    class methods(models.TextChoices):
        sync = 'sync'
        manually = 'man'

    class types(models.TextChoices):
        block = 'block'
        line = 'line'
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, default='')
    title = models.CharField(max_length=50)
    addTime = models.DateTimeField(auto_now_add=True)
    startTime = models.DateTimeField(
        'start Time', default=django.utils.timezone.now)
    endTime = models.DateTimeField('end Time',  default=django.utils.timezone.now)
    method = models.CharField(max_length=4, choices=methods.choices)
    type = models.CharField(max_length=6, choices=types.choices)
    details = models.CharField(max_length=200)
    estTime = models.IntegerField(default=0)
    actualTime = models.IntegerField(default=0)
    group = models.ForeignKey(Course, on_delete=models.CASCADE, default='')

    def __str__(self):
        return self.title
