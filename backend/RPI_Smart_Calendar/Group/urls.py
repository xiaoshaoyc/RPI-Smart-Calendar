from django.urls import path

from . import views

app_name = 'Group'
# this is the urls frontend could visit to get the json, for more details please check:
# https://docs.google.com/document/d/1iTl0gEgj4wMrda3VOJ2xXBzo5-s4SF7mQ3jpFgvA9zQ/edit
urlpatterns = [
    path('',views.DisplayCourses.as_view(), name = "Courses"),
    path('<group_id>/receive', views.ReceiveMessage.as_view(), name='ReceiveMessage'),
    path('<group_id>/message', views.DisplayMessages.as_view(), name='DisplayMessages'),
    path('<group_id>/user', views.DisplayUsers.as_view(), name='DisplayUsers'),
]
