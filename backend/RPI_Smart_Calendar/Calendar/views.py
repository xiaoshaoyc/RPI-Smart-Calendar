from django.db.models.base import Model
from django.http.response import Http404
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
    return render(request, 'Calendar/week.html', {'week': week})

class WeekView(generic.DeleteView):
    template_name = 'Calendar/week.html'
    model = Week

class EventView(generic.ListView):
    template_name = 'Calendar/event.html'
    def get_queryset(self):
        return  


