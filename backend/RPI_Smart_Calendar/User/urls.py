from django.urls import path

from . import views

app_name = 'User'

urlpatterns = [
    path('', views.Logout.as_view(), name='logout'),
    path('auth/', views.Authenticate.as_view(), name='authenticate'),

]
