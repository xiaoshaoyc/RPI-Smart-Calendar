from django import http
from django.db.models.base import Model
from django.http.response import Http404, JsonResponse
from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from .models import Event
# Create your views here.
from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect, request
from django.views import generic
from django.utils import timezone
from datetime import date

class IndexView(generic.ListView):
    template_name = 'Calendar/index.html'
    def get_queryset(self):
        return 
        
def curWeek(request):
    year_number = date.today().isocalendar()[0]
    week_number = date.today().isocalendar()[1]
    return week(request,year_number,week_number)

def week(request,year_num,week_num):
    try:
        events_year = Event.objects.filter(startTime__year = year_num)
        events_week = events_year.filter(startTime__week = week_num)
    except:
        raise Http404("Week does not exist")
    schedules = []
    for day in range(1,8):
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



