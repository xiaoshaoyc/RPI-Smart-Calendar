from django.urls import path

from . import views

app_name = 'User'
# this is the urls frontend could visit to get the json, for more details please check:
# https://docs.google.com/document/d/1iTl0gEgj4wMrda3VOJ2xXBzo5-s4SF7mQ3jpFgvA9zQ/edit
urlpatterns = [
    path('logout/', views.Logout.as_view(), name='logout'),
    path('auth/', views.Authenticate.as_view(), name='authenticate'),
    path('register/', views.register_request, name='register'),

]
