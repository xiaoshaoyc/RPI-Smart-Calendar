from django import http
from django.db.models.base import Model
from django.http.response import Http404, JsonResponse
from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from .models import Week, Day, Event
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
    curWeek_number = 1
    try:
        week = Week.objects.get(pk=curWeek_number)

    except Week.DoesNotExist:
        raise Http404("Week does not exist")
    
    schedules = []
    for day in week.day_set.all().order_by('day_number'):
        schedule = {}
        for event in day.event_set.all():
            jevent = {}
            jevent['eventType'] = event.type
            jevent['id'] = event.id
            jevent['title'] = event.title
            jevent['startTime'] = event.startTime
            jevent['endTime'] = event.endTime
            schedule[event.id] = jevent
        schedules.append(schedule)
    return JsonResponse(schedules,safe = False)
    # return render(request, 'Calendar/week.html', {'week': week})

def week(request,week_num):
    try:
        week = Week.objects.get(pk=week_num)
    except Week.DoesNotExist:
        raise Http404("Week does not exist")
    schedules = []
    for day in week.day_set.all().order_by('day_number'):
        schedule = {}
        for event in day.event_set.all():
            jevent = {}
            jevent['eventType'] = event.type
            jevent['id'] = event.id
            jevent['title'] = event.title
            jevent['startTime'] = event.startTime
            jevent['endTime'] = event.endTime
            schedule[event.id] = jevent
        schedules.append(schedule)
    return JsonResponse(schedules,safe = False)
class EventView(generic.ListView):
    template_name = 'Calendar/event.html'
    def get_queryset(self):
        return  


