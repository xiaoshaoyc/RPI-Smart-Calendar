from Group.models import MyGroup
from django.http.response import JsonResponse
from django.views import generic
from datetime import date
from django.views import View
from User.models import User
from .models import Event
import dateutil.parser
import json
import datetime
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import logging
# the class would return current week schedules if logined in
# return fail messaege if not login
class CurWeekView(View):
    def get(self,request):
        # get current year and week
        year_num = date.today().isocalendar()[0]
        week_num = date.today().isocalendar()[1]
        return WeekView.get(self,request, year_num, week_num)

# the class would return schedules of the specified week if logined in
# return fail message if not login
# return fail message if week not exist
class WeekView(View):
    def get(self,request, year_num, week_num):
        output = {}
        schedules = []
        output['data'] = schedules
        # get user id 
        user_id = request.session.get('user_id', None) 
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        # get week
        events = user.event_set.all()
        # get needed events if event exist
        try:
            events_year = events.filter(startTime__year=year_num)
            events_week = events_year.filter(startTime__week=week_num)
        except:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: WEEK NOT EXIST'
            return JsonResponse(status=500, data = output, safe=False)
        # get event and save to output
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

# the class would return specified event info if logined in
# return fail message if not login
# return fail message if event not exist
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
        # try to get event
        events = user.event_set.all()
        try:
            event = events.get(id=id)
        # event not exist
        except:
            jevent["isSuccess"] = False
            jevent["Message"] = 'FAIL: EVENT NOT EXIST FOR THE USER'
            return JsonResponse(status=500, data = jevent, safe=False)
        # save event info
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

# the function would return the avergae time of the event set
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

# the class return a analysis of current week if login
# return fail message if not login
class CurAnalysisView(View):
    def get(self,request):
        year_num = date.today().isocalendar()[0]
        week_num = date.today().isocalendar()[1]
        return AnalysisView.get(self,request, year_num, week_num)
        
# the class returns analysis of the specified week
# return fail message if not login
# return fail message if week not exist
class AnalysisView(View):
    def get(self,request,year_num,week_num):
        output = {}
        courses = []
        output['data'] = courses
        # try to get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        # not login
        else:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        # get all courses the user is taking
        groups = user.groups.all()
        for group in groups:
            # add output
            course = {}
            courseinfo = {}
            course[group.group_id] = courseinfo
            courses.append(course)
            # get all assignments of the coursee
            events = user.event_set.all()
            try:
                events_year = events.filter(startTime__year=year_num,type = 'line', group = group)
                events_last_week = events_year.filter(startTime__week=week_num-1)
                events_this_week = events_year.filter(startTime__week=week_num)
                events_next_week = events_year.filter(startTime__week=week_num+1)
            # week not exist
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

# the class add a event for the current user
# need to pass in title, detail, startTime, and endTime of the event if isblock
# need to pass in groupid and endTime otherwise
# return fail message if not login
@method_decorator(csrf_exempt, name='dispatch')
class AddEvent(View):
    def post(self, request):
        # get the input
        title = request.POST["title"]
        details = request.POST["details"]
        startTime = request.POST["startTime"]
        endTime = request.POST["endTime"]
        type = request.POST["type"]
        groupid = request.POST["groupid"]
        output = {}
        if type not in ['block', 'line']:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: WRONG TYPE'
            return JsonResponse(status=401, data = output, safe=False)
        #calculate time
        try:
            startTime = dateutil.parser.parse(startTime, ignoretz=True)
            endTime = dateutil.parser.parse(endTime, ignoretz=True)
        except:
            return JsonResponse(status=500, data={})
        # get user
        user_id = request.session.get('user_id', None)
        if user_id is not None:
            user = User.objects.get(id=user_id)
        # user not exist
        else:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        # get group
        group = None
        if type=='line':
            try:
                group = MyGroup.objects.all().get(group_id = groupid)
            except:
                output["isSuccess"] = False
                output["Message"] = 'FAIL: USER IS NOT IN THE GROUP'
                return JsonResponse(status=401, data = output, safe=False)
        #save event
        if type=='block':
            event = Event(user = user, title = title, startTime = startTime, endTime = endTime,
                        method = 'manually', type = type, details = details)
        else:
            event = Event(user = user, group = group, endTime = endTime,
                        method = 'manually', type = type, details = details)
        event.save()
        output["isSuccess"] = True
        output["Message"] = 'SUCESS'
        return JsonResponse(status=200, data = output, safe=False)

# the class edit a event for the current user
# need to pass in title, detail, startTime, and endTime of the event
# return fail message if not login
class EditEvent(View):
    def get(self,request,event_id):
        #delete event
        myjson = DeleteEvent.get(self,request,event_id)
        data = json.loads(myjson.content)
        if data['isSuccess']==False:
            return myjson
        #add event
        # AddEvent.post(self, request)
        return AddEvent.get(self, request)

# the class would delete the specified event
# return fail message if not login
class DeleteEvent(View):
    def get(self,request,event_id):
        output = {}
        # get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        # user not login
        else:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        # get event
        events = Event.objects.all().filter(user=user)
        try:
            event = events.get(id = event_id)
        # event not exist
        except:
            output["isSuccess"] = False
            output["Message"] = 'FAIL: EVENT NOT EXIST'
            return JsonResponse(status=401, data = output, safe=False)
        # delete event
        event.delete()
        output["isSuccess"] = True
        output["Message"] = 'SUCESS'
        return JsonResponse(status=200, data = output, safe=False)
# the class would return a list of dues passed the time this week or next week
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

# the class would update actualTime of the due
# require to pass in actualTime and event_id of the assignment
# return fail message if no such a event
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

