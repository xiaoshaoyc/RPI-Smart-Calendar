from django.contrib.auth.models import User
from django.http.response import JsonResponse
from django.utils.translation import gettext_lazy as _
from django.db import models
import django
from django.conf import settings
from Group.models import MyGroup
from django.utils import timezone
import datetime
from sklearn import linear_model
# Create your models here

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
        'start Time', default=django.utils.timezone.now, blank=True, null=True)
    endTime = models.DateTimeField('end Time',  default=django.utils.timezone.now)
    method = models.CharField(max_length=4, choices=methods.choices)
    type = models.CharField(max_length=6, choices=types.choices)
    details = models.CharField(max_length=200)
    actualTime = models.IntegerField(null=True,blank=True)
    group = models.ForeignKey(MyGroup, on_delete=models.CASCADE, default='', blank=True, null=True)
    #calculate estTime
    def calculate_estTime(self):
        #get all dues with actualTime
        events = Event.objects.filter(type = 'line',actualTime__isnull=False)
        X = []
        y = []
        # get data first
        for event in events:
            x1 = []
            endTime = event.endTime
            endTime = 10000*endTime.year + 100*endTime.month + endTime.day
            groupid = event.group.group_id
            front = sum([ord(c) for c in groupid[:4]])
            groupid = front*10000+int(groupid[4:])
            x1.append(event.user.id)
            x1.append(endTime)
            x1.append(groupid)
            X.append(x1)
            y.append(event.actualTime)
        # set model
        clf = linear_model.Lasso(normalize=True)
        #train the model
        clf.fit(X,y)
        #predict
        myx = []
        endTime = 10000*self.endTime.year + 100*self.endTime.month + self.endTime.day
        groupid = self.group.group_id
        front = sum([ord(c) for c in groupid[:4]])
        groupid = front*10000+int(groupid[4:])
        myx.append(self.user.id)
        myx.append(endTime)
        myx.append(groupid)
        return clf.predict([myx])[0]
    def estTime(self):
        #if event
        if self.type=='block':
            return (self.endTime-self.startTime).seconds
        #if due
        else:
            if self.actualTime:
                return self.actualTime
            else:
                return self.calculate_estTime()

    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(weeks=2) <= self.endTime <= now
    def __str__(self):
        return self.title
