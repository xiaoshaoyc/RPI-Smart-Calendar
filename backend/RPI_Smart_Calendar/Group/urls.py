from django.urls import path

from . import views

app_name = 'Group'

urlpatterns = [
    path('',views.DisplayCourses.as_view(), name = "Courses"),
    path('/<int:course_id>/receive', views.ReceiveMessage.as_view(), name='ReceiveMessage'),
    path('/<int:course_id>/message', views.DisplayMessages.as_view(), name='DisplayMessages'),
    path('/<int:course_id>/user', views.DisplayUsers.as_view(), name='DisplayUsers'),

]
