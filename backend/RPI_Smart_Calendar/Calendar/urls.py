from django.urls import path

from . import views

# this is the urls frontend could visit to get the json, for more details please check:
# https://docs.google.com/document/d/1iTl0gEgj4wMrda3VOJ2xXBzo5-s4SF7mQ3jpFgvA9zQ/edit
app_name = 'Calendar'
urlpatterns = [
    path('week/', views.CurWeekView.as_view(), name='CurWeek'),
    path('week/<int:year_num>/<int:week_num>',views.WeekView.as_view(), name='week'),
    path('event/<int:id>', views.EventView.as_view(), name='event'),
    path('analysis/', views.CurAnalysisView.as_view(), name='CurAnalysis'),
    path('analysis/<int:year_num>/<int:week_num>', views.AnalysisView.as_view(), name='Analysis'),
    path('event/add', views.AddEvent.as_view(), name='AddEvent'),
    path('event/<int:event_id>/edit', views.EditEvent.as_view(), name='EditEvent'),
    path('event/<int:event_id>/delete', views.DeleteEvent.as_view(), name='DeleteEvent'),
    path('due/', views.DueView.as_view(), name='ListDue'),
    path('due/register', views.UpdateDue.as_view(), name='RegisterDue'),
]