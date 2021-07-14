from django.urls import path

from . import views

app_name = 'Calendar'

urlpatterns = [
    # path('login/', views.LoginView.as_view(), name='login'),
    # path('logout/', views.LogoutView.as_view(), name='logout'),

    # path('', views.SettingsBackend, name='Backend'),
    # path('<int:question_id>/vote/', views.vote, name='vote'),
    path('login/auth',views.login, name = "Login"),
    # path('login/auth', views.authenticate, name='authenticate'),
    # path('login/', views.get_user, name='get_user'),
    # path('login/', views.get_course, name='get_course'),
]
