from django.urls import path

from . import views

app_name = 'Group'

urlpatterns = [
    path('',views.CourseView.as_view(), name = "Courses"),

]
