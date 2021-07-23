from django.http.response import JsonResponse
from django.views import generic
from datetime import date
from django.views import View
from User.models import User


class IndexView(generic.ListView):
    template_name = 'Calendar/index.html'

    def get_queryset(self):
        return

class CurWeekView(View):
    def get(self,request):
        year_num = date.today().isocalendar()[0]
        week_num = date.today().isocalendar()[1]
        return WeekView.get(self,request, year_num, week_num)
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
            return JsonResponse(output, safe=False)
        # get week
        events = user.event_set.all()
        try:
            events_year = events.filter(startTime__year=year_num)
            events_week = events_year.filter(startTime__week=week_num)
        except:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: WEEK NOT EXIST'
            return JsonResponse(output, safe=False)
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
        return JsonResponse(output, safe=False)

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
            return JsonResponse(jevent, safe=False)
        # get event
        events = user.event_set.all()
        try:
            event = events.get(id=id)
        except:
            jevent["isSuccess"] = False
            jevent["Messgae"] = 'FAIL: EVENT NOT EXIST'
            return JsonResponse(jevent, safe=False)
        jevent['id'] = event.id
        jevent['eventType'] = event.type
        jevent['estTime'] = event.estTime
        jevent['details'] = event.details
        jevent['method'] = event.method
        jevent['title'] = event.title
        jevent['label'] = [event.group.group_id]
        jevent["isSuccess"] = True
        jevent["Messgae"] = 'SUCCESS'
        return JsonResponse(jevent, safe=False)
