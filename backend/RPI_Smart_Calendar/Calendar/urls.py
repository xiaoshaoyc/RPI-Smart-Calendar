from django.urls import path

from . import views

app_name = 'Calendar'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('week/', views.CurWeekView.as_view(), name='CurWeek'),
    path('week/<int:year_num>/<int:week_num>',views.WeekView.as_view(), name='week'),
    path('event/<int:id>', views.EventView.as_view(), name='event'),

]