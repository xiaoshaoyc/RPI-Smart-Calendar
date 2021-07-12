from django.urls import path

from . import views

app_name = 'polls'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('week/', views.CurWeekView.as_view(), name='CurWeek'),
    path('week/0', views.WeekView.as_view(), name='week'),
    path('event/0', views.EventView.as_view(), name='event'),
]