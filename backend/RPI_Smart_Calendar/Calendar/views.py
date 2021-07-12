from django.db.models.base import Model
from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
# Create your views here.
from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect
from django.views import generic
from django.utils import timezone

class IndexView(generic.ListView):
    template_name = 'Calendar/index.html'
    def get_queryset(self):
        return 
class CurWeekView(generic.ListView):
    template_name = 'Calendar/week.html'
    def get_queryset(self):
        return 
class WeekView(generic.ListView):
    template_name = 'Calendar/week.html'
    def get_queryset(self):
        return
class EventView(generic.ListView):
    template_name = 'Calendar/event.html'
    def get_queryset(self):
        return  


