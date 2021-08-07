from django.contrib import admin
from django.urls import include, path
# this is the urls frontend could visit to get the json, for more details please check:
# https://docs.google.com/document/d/1iTl0gEgj4wMrda3VOJ2xXBzo5-s4SF7mQ3jpFgvA9zQ/edit
urlpatterns = [
    path('admin/', admin.site.urls),
    path('calendar/', include('Calendar.urls')),
    path('login/',include('User.urls')),
    path('group/',include('Group.urls'))
]
