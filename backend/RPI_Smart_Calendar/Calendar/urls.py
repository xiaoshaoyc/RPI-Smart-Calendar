from django.urls import path

from . import views

app_name = 'Calendar'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('week/', views.curWeek, name='CurWeek'),
    path('week/<int:year_num>/<int:week_num>',views.week, name='week'),
    path('event/<int:id>', views.event, name='event'),

]