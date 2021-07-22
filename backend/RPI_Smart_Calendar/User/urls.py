from django.urls import path

from . import views

app_name = 'User'

urlpatterns = [
    path('', views.LogoutView.as_view(), name='authenticate'),
    path('auth/', views.AuthenticateView.as_view(), name='authenticate'),
]
