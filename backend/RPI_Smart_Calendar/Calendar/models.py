import datetime
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.utils import timezone
from django.views.generic import detail
import django
# Create your models here.
class Week(models.Model):
    week_number = models.BigAutoField(primary_key=True)
    def __str__(self):
        return 'week'+str(self.week_number)

class Day(models.Model):
    class days(models.IntegerChoices):
        Sunday = 0, _('SUN')
        Monday = 1, _('MON')
        Tuesday = 2, _('TUE')
        Wednesday = 3, _('WED')
        Thursday = 4, _('THU')
        Friday = 5, _('FRI')
        Saturday = 6, _('SAT')
    week = models.ForeignKey(Week, on_delete=models.CASCADE)
    day_number = models.IntegerField(choices=days.choices)
    def __str__(self):
        return 'day'+str(self.day_number)

class Event(models.Model):
    class methods(models.TextChoices):
        sync = 'sync'
        manually = 'man'
    class types(models.TextChoices):
        block = 'block'
        line = 'line'
    day = models.ForeignKey(Day, on_delete=models.CASCADE,default='')
    title = models.CharField(max_length=50)
    addTime = models.DateTimeField(auto_now_add=True)
    startTime = models.DateTimeField('start Time')
    endTime = models.DateTimeField('end Time',default=django.utils.timezone.now)
    method = models.CharField(max_length=4,choices=methods.choices)
    type = models.CharField(max_length=6,choices=types.choices)
    details = models.CharField(max_length=200)
    estTime = models.IntegerField(default=0)
    group = models.CharField(max_length=50, default='')
    def __str__(self):
        return self.title
