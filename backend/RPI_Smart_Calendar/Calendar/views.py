from django.http.response import JsonResponse
from django.views import generic
from datetime import date
from django.views import View
from User.models import User
from .models import Event
import dateutil.parser
import datetime
from django.utils import timezone
#return current week schedules
class CurWeekView(View):
    def get(self,request):
        year_num = date.today().isocalendar()[0]
        week_num = date.today().isocalendar()[1]
        return WeekView.get(self,request, year_num, week_num)

#return schedules of the specified week
class WeekView(View):
    def get(self,request, year_num, week_num):
        output = {}
        schedules = []
        output['data'] = schedules
        # get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        # get week
        events = user.event_set.all()
        try:
            events_year = events.filter(startTime__year=year_num)
            events_week = events_year.filter(startTime__week=week_num)
        except:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: WEEK NOT EXIST'
            return JsonResponse(status=500, data = output, safe=False)
        # get event
        for day in range(1, 8):
            schedule = []
            events_day = events_week.filter(startTime__week_day=day)
            for event in events_day:
                jevent = {}
                jevent['id'] = event.id
                jevent['eventType'] = event.type
                jevent['title'] = event.title
                jevent['startTime'] = event.startTime
                jevent['endTime'] = event.endTime
                schedule.append(jevent)
            schedules.append(schedule)
        output["isSuccess"] = True
        output["Messgae"] = 'SUCCESS'
        return JsonResponse(status=200, data = output, safe=False)

#return specified event info
class EventView(View):
    def get(self,request, id):
        jevent = {}
        # get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            jevent["isSuccess"] = False
            jevent["Messgae"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = jevent, safe=False)
        # get event
        events = user.event_set.all()
        try:
            event = events.get(id=id)
        except:
            jevent["isSuccess"] = False
            jevent["Messgae"] = 'FAIL: EVENT NOT EXIST FOR THE USER'

            return JsonResponse(status=500, data = jevent, safe=False)
        jevent['id'] = event.id
        jevent['eventType'] = event.type
        jevent['estTime'] = event.estTime()
        jevent['details'] = event.details
        jevent['method'] = event.method
        jevent['title'] = event.title
        jevent['label'] = []
        try:
            jevent['label'].append(event.group.group_id)
        except:
            pass
        jevent["isSuccess"] = True
        jevent["Messgae"] = 'SUCCESS'
        return JsonResponse(status=200, data = jevent, safe=False)


class CurAnalysisView(View):
    def get(self,request):
        pass

class AnalysisView(View):
    def get(self,request,year_num,week_num):
        pass

class AddEvent(View):
    def get(self,request):
        # title = request.POST["title"]
        # detail = request.POST["detail"]
        # startTime = request.POST["startTime"]
        # endTime = request.POST["endTime"]
        title = "SDD MEETING2"
        detail = "MEETING WITH MAV AGAIN"
        startTime = str(timezone.now())
        endTime = str(timezone.now()+datetime.timedelta(hours=2))

        output = {}
        # get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        #calculate time
        startTime = dateutil.parser.parse(startTime, ignoretz=True)
        endTime = dateutil.parser.parse(endTime, ignoretz=True)
        #save event
        event = Event(user = user, title = title, startTime = startTime, endTime = endTime,
                        method = 'manually', type = 'block', details = detail)
        event.save()
        output["isSuccess"] = True
        output["Messgae"] = 'SUCESS'
        return JsonResponse(status=200, data = output, safe=False)
class EditEvent(View):
    def get(self,request):
        pass

class DeleteEvent(View):
    def get(self,request):
        pass

#Return list of dues passed the time this week or next week
class DueView(View):
    def get(self,request):
        output = {}
        data = []
        output['data'] = data
        #filter events
        events = Event.objects.all().filter(type = 'line',actualTime__isnull=True)
        for event in events:
            if event.was_published_recently():
                eventinfo = {}
                eventinfo['id'] = event.id
                eventinfo['title'] = event.title
                eventinfo['startTime'] = event.startTime
                eventinfo['endTime'] = event.endTime
                data.append(eventinfo)
        output["isSuccess"] = True
        output["Messgae"] = 'SUCCESS'
        return JsonResponse(status=200, data = output, safe=False)

#update actualTime of the due
class UpdateDue(View):
    def get(self,request):
        # actualTime = request.POST["actualTime"]
        # event_id = request.POST["event_id"]
        output = {}
        actualTime = 180
        event_id = 1
        #get event
        try:
            event = Event.objects.get(id = event_id)
        except:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: EVENT NOT EXIST'
        #save event
        event.actualTime = actualTime
        event.save()
        output["isSuccess"] = True
        output["Messgae"] = 'SUCESS: EVENT SAVED'
        return JsonResponse(status=200, data = output, safe=False)

