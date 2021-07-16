from django.urls import path

from . import views

app_name = 'User'

urlpatterns = [
    path('login/auth', views.authenticate, name='authenticate'),
    path('group/',views.get_course, name = "Courses"),
    path('register/',views.register, name = "Register")
]
