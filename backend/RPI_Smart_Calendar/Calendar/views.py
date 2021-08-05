from django.http.response import JsonResponse
from django.views import generic
from datetime import date
from django.views import View
from User.models import User
from .models import Event
import dateutil.parser
import datetime
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import logging
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
        user_id = request.session.get('user_id', 2) # TODO: delete
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        # get week
        events = user.event_set.all()
        try:
            events_year = events.filter(startTime__year=year_num)
            events_week = events_year.filter(startTime__week=week_num)
        except:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: WEEK NOT EXIST'
            return JsonResponse(status=500, data = output, safe=False)
        # get event
        for day in range(1, 8):
            schedule = []
            events_day = events_week.filter(startTime__week_day=day)
            for event in events_day:
                jevent = {}
                jevent['id'] = event.id
                jevent['eventType'] = event.type
                jevent['title'] = event.get_title()
                jevent['startTime'] = event.startTime
                jevent['endTime'] = event.endTime
                schedule.append(jevent)
            schedules.append(schedule)
        output["isSuccess"] = True
        output["Message"] = 'SUCCESS'
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
            jevent["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = jevent, safe=False)
        # get event
        events = user.event_set.all()
        try:
            event = events.get(id=id)
        except:
            jevent["isSuccess"] = False
            jevent["Message"] = 'FAIL: EVENT NOT EXIST FOR THE USER'

            return JsonResponse(status=500, data = jevent, safe=False)
        jevent['id'] = event.id
        jevent['eventType'] = event.type
        jevent['estTime'] = event.estTime()
        jevent['details'] = event.get_details()
        jevent['method'] = event.method
        jevent['title'] = event.get_title()
        jevent['label'] = []
        try:
            jevent['label'].append(event.group.group_id)
        except:
            pass
        jevent["isSuccess"] = True
        jevent["Message"] = 'SUCCESS'
        return JsonResponse(status=200, data = jevent, safe=False)

def cal_time(events_week):
    week_time = 0
    count = 0
    for week in events_week:
        week_time+=week.estTime()
        count+=1
    if count ==0:
        return 0
    else:
        return week_time/count
# analysis of current week
class CurAnalysisView(View):
    def get(self,request):
        year_num = date.today().isocalendar()[0]
        week_num = date.today().isocalendar()[1]
        return AnalysisView.get(self,request, year_num, week_num)
# return analysis
class AnalysisView(View):
    def get(self,request,year_num,week_num):
        output = {}
        courses = []
        output['data'] = courses
        # get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        groups = user.groups.all()
        for group in groups:
            course = {}
            courseinfo = {}
            course[group.group_id] = courseinfo
            courses.append(course)
            # get week
            events = user.event_set.all()
            try:
                events_year = events.filter(startTime__year=year_num,type = 'line', group = group)
                events_last_week = events_year.filter(startTime__week=week_num-1)
                events_this_week = events_year.filter(startTime__week=week_num)
                events_next_week = events_year.filter(startTime__week=week_num+1)
            except:
                output["isSuccess"] = False
                output["Message"] = 'FAIL: WEEK NOT EXIST'
                return JsonResponse(status=500, data = output, safe=False)
            #calculate time
            courseinfo['avg_time'] = cal_time(events_year)
            courseinfo['last_time'] = cal_time(events_last_week)
            courseinfo['this_time'] = cal_time(events_this_week)
            courseinfo['next_time'] = cal_time(events_next_week)
        return JsonResponse(status=200, data = output, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class AddEvent(View):
    def post(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)

        title = request.POST["title"]
        details = request.POST["details"]
        startTime = request.POST["startTime"]
        endTime = request.POST["endTime"]
        # startTime = str(timezone.now())
        # endTime = str(timezone.now()+datetime.timedelta(hours=2))
        logger.error(startTime)
        #calculate time
        startTime = dateutil.parser.parse(startTime, ignoretz=True)
        endTime = dateutil.parser.parse(endTime, ignoretz=True)

        logger.error(startTime)

        output = {}
        # get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        #save event
        event = Event(user = user, title = title, startTime = startTime, endTime = endTime,
                        method = 'manually', type = 'block', details = details)
        event.save()
        output["isSuccess"] = True
        output["Message"] = 'SUCESS'
        return JsonResponse(status=200, data = output, safe=False)

#edit event
class EditEvent(View):
    def get(self,request,event_id):
        # title = request.POST["title"]
        # detail = request.POST["details"]
        # startTime = request.POST["startTime"]
        # endTime = request.POST["endTime"]
        title = "SDD MEETING3"
        details = "MEETING WITH MAV AGAIN"
        startTime = str(timezone.now())
        endTime = str(timezone.now()+datetime.timedelta(hours=2))

        #calculate time
        startTime = dateutil.parser.parse(startTime, ignoretz=True)
        endTime = dateutil.parser.parse(endTime, ignoretz=True)
        output = {}
        # get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        # get event
        events = Event.objects.all().filter(user=user)
        try:
            event = events.get(id = event_id)
        except:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: EVENT NOT EXIST'
            return JsonResponse(status=401, data = output, safe=False)
        if event.type !='block':
            output["isSuccess"] = False
            output["Message"] = 'FAIL: NOT BLOCK'
            return JsonResponse(status=401, data = output, safe=False)
        #delete event
        event.delete()
        #save event
        event = Event(user = user, title = title, startTime = startTime, endTime = endTime,
                        method = 'manually', type = 'block', details = details)
        event.save()
        output["isSuccess"] = True
        output["Message"] = 'SUCESS'
        return JsonResponse(status=200, data = output, safe=False)

class DeleteEvent(View):
    def get(self,request,event_id):
        output = {}
        # get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        # get event
        events = Event.objects.all().filter(user=user)
        try:
            event = events.get(id = event_id)
        except:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: EVENT NOT EXIST'
            return JsonResponse(status=401, data = output, safe=False)
        if event.type !='block':
            output["isSuccess"] = False
            output["Message"] = 'FAIL: NOT BLOCK'
            return JsonResponse(status=401, data = output, safe=False)
        #delete event
        event.delete()
        output["isSuccess"] = True
        output["Message"] = 'SUCESS'
        return JsonResponse(status=200, data = output, safe=False)
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
                eventinfo['title'] = event.get_title()
                eventinfo['startTime'] = event.startTime
                eventinfo['endTime'] = event.endTime
                data.append(eventinfo)
        output["isSuccess"] = True
        output["Message"] = 'SUCCESS'
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
            output["Message"] = 'FAIL: EVENT NOT EXIST'
        #save event
        event.actualTime = actualTime
        event.save()
        output["isSuccess"] = True
        output["Message"] = 'SUCESS: EVENT SAVED'
        return JsonResponse(status=200, data = output, safe=False)

