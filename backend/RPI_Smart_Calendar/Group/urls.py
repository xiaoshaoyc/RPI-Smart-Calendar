from django.urls import path

from . import views

app_name = 'Group'

urlpatterns = [
    path('',views.DisplayCourses.as_view(), name = "Courses"),

]
