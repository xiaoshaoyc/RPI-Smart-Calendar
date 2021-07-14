from django import http
from django.db.models.base import Model
from django.http.response import Http404, JsonResponse
from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from .models import Week, Day, Event, Year
# Create your views here.
from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect, request
from django.views import generic
from django.utils import timezone

class IndexView(generic.ListView):
    template_name = 'Calendar/index.html'
    def get_queryset(self):
        return 
def curWeek(request):
    year_number = timezone.now().year
    curWeek_number = 1
    try:
        year = Year.objects.get(year_number = year_number)
        weeks = year.week_set.all()
        week = weeks.get(pk = curWeek_number)

    except:
        raise Http404("Week does not exist")
    

    schedules = []
    for day in week.day_set.all().order_by('day_number'):
        schedule = []
        for event in day.event_set.all():
            jevent = {}
            jevent['id'] = event.id
            jevent['eventType'] = event.type
            jevent['title'] = event.title
            jevent['startTime'] = event.startTime
            jevent['endTime'] = event.endTime
            schedule.append(jevent)
        schedules.append(schedule)
    return JsonResponse(schedules,safe = False)
    # return render(request, 'Calendar/week.html', {'week': week})

def week(request,year_num,week_num):
    try:
        year = Year.objects.get(year_number = year_num)
        weeks = year.week_set.all()
        week = weeks.get(pk = week_num)

    except:
        raise Http404("Week does not exist")
    schedules = []
    for day in week.day_set.all().order_by('day_number'):
        schedule = []
        for event in day.event_set.all():
            jevent = {}
            jevent['id'] = event.id
            jevent['eventType'] = event.type
            jevent['title'] = event.title
            jevent['startTime'] = event.startTime
            jevent['endTime'] = event.endTime
            schedule.append(jevent)
        schedules.append(schedule)
    return JsonResponse(schedules,safe = False)

def event(request, id):
    try:
        event = Event.objects.get(id = id)
    except:
        raise Http404("Event does not exist")
    jevent = {}
    jevent['id'] = event.id
    jevent['eventType'] = event.type
    jevent['estTime'] = event.estTime
    jevent['details'] = event.details
    jevent['method'] = event.method
    jevent['title'] = event.title
    jevent['label'] = [event.group]
    return JsonResponse(jevent,safe = False)



