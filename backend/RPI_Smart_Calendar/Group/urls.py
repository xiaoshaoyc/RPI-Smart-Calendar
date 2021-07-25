from django.urls import path

from . import views

app_name = 'Group'

urlpatterns = [
    path('',views.DisplayCourses.as_view(), name = "Courses"),
    path('<group_id>/receive', views.ReceiveMessage.as_view(), name='ReceiveMessage'),
    path('<group_id>/message', views.DisplayMessages.as_view(), name='DisplayMessages'),
    path('<group_id>/user', views.DisplayUsers.as_view(), name='DisplayUsers'),

]
