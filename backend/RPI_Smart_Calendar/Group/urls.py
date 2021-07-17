from django.urls import path

from . import views

app_name = 'Group'

urlpatterns = [
    path('',views.get_course, name = "Courses"),
]
