from django.urls import path

from . import views

app_name = 'User'

urlpatterns = [
    path('', views.logout, name='authenticate'),
    path('auth/', views.authenticate, name='authenticate'),
]
