from django.utils.translation import gettext_lazy as _
from django.db import models
import django
from django.conf import settings
from Group.models import MyGroup
from django.utils import timezone
import datetime
from sklearn import linear_model

# The Event model represents both assignments and events
class Event(models.Model):
    # This is the choice indicating whether the event is added by synchronization or manually 
    class methods(models.TextChoices):
        sync = 'sync'
        manual = 'manual'
    # This is the choice indicating whether the event is a block or line
    # line means the assignment is a assignment due
    # block means the schedule of the event
    class types(models.TextChoices):
        block = 'block'
        line = 'line'
    # user indicates the user of the event
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    # title indicates the event tile if type == block
    # no need to set if the type == line
    title = models.CharField(max_length=256)
    # addTime indicates the time the event is added
    addTime = models.DateTimeField(auto_now_add=True)
    # startTime indicates when a event would start if type == block
    # no need to set if the type == line
    startTime = models.DateTimeField(
        'start Time', default=django.utils.timezone.now, blank=True, null=True)
    # endTime indicates when a event would end if type == block
    # or the due date of the assignment if type == line
    endTime = models.DateTimeField('end Time',  default=django.utils.timezone.now)
    # method indicates whether the event is added by synchronization or manually 
    method = models.CharField(max_length=32, choices=methods.choices, default='sync')
    # type indicates whether the event is a block or line
    type = models.CharField(max_length=32, choices=types.choices, default='block')
    # detail descriptions about the event if type == block
    # no need to set if type == line
    details = models.CharField(max_length=1024, blank=True, default='')
    # no need to set if type == block
    # actualTime indicates the actual time used by the user to finish the assignment if type == line
    # no need to set if unfinished if type == line
    actualTime = models.IntegerField(blank=True, default=0)
    # no need to set if type == block
    # group indicates the course of the assignment if type == line
    group = models.ForeignKey(MyGroup, on_delete=models.CASCADE, blank=True, null=True)
    # calculate the estimate time of the assignment using machine learning model
    def calculate_estTime(self):
        #get all dues with actualTime
        events = Event.objects.filter(type = 'line',actualTime__gt=0)
        if len(events)==0:
            return 0
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
        return max(0,clf.predict([myx])[0])
    # calculate estimate time needed to return
    # return endTime - startTime if type == block
    # return actualTime if actualTime is set if type == line
    # return the result get from machine learning model if not set and type == line
    def estTime(self):
        #if event
        if self.type=='block':
            return (self.endTime-self.startTime).seconds
        #if due
        else:
            if self.actualTime>0:
                return self.actualTime
            else:
                return self.calculate_estTime()
    
    # get title of the event
    # return title if type == block
    # return group id + 'DUE' if type == line
    def get_title(self):
        if self.type=='line':
            if (self.group != None):
                return self.group.group_id + ' DUE'
        else:
            return self.title
    # get detail of the event
    # return detail if type == block
    # return group name + 'DUE' if type == line
    def get_details(self):
        if self.type=='block':
            return self.details
        else:
            if self.details=='':
                return self.group.name + ' DUE'
            else:
                return self.details
    # check if the event was published within two weeks
    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(weeks=2) <= self.endTime <= now
    # the displayed name of the model is title
    def __str__(self):
        if self.type == 'block':
            return self.title
        else:
            return self.group.name + " DUE"
