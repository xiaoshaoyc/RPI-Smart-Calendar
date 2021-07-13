from django.urls import path

from . import views

app_name = 'Calendar'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('week/', views.curWeek, name='CurWeek'),
    path('week/<int:pk>', views.WeekView.as_view(), name='week'),
    path('event/0', views.EventView.as_view(), name='event'),
]