from django.http import HttpResponse
from django import http
from django.db.models.base import Model
from django.http.response import Http404, JsonResponse


#def index(request):
#    return HttpResponse("Hello, world. You're at the polls index.")

from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User

# class SettingsBackend(BaseBackend):
"""
Authenticate against the settings ADMIN_LOGIN and ADMIN_PASSWORD.

Use the login name and a hash of the password. For example:

ADMIN_LOGIN = 'admin'
ADMIN_PASSWORD = 'pbkdf2_sha256$30000$Vo0VlMnkR4Bk$qEvtdyZRWTcOsCnI/oQ7fVOu1XAURIZYoOZ3iq8Dr4M='
"""

def authenticate(request):
    username = request.POST["username"]
    password = request.POST["password"]
    # password = request.password
    login_valid = (settings.ADMIN_LOGIN == username)
    pwd_valid = check_password(password, settings.ADMIN_PASSWORD)
    output = {}
    if login_valid and pwd_valid:
        try:
            user = User.objects.get(username=username)
            output["message"] = "LOGIN SUCCESS"
            output["auth"] = True
            return JsonResponse(output, safe = False)
        except User.DoesNotExist:
            # Create a new user. There's no need to set a password
            # because only the password from settings.py is checked.
            '''
            user = User(username=username)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            '''
            output["message"] = "ERROR: LOGIN FAILURE, USER DOES NOT EXSIST"
            output["auth"] = False
            return JsonResponse(output, safe = False)
    if not pwd_valid and login_valid:
        output["message"] = "ERROR: WRONG PASSWORD"
        output["auth"] = False
        return JsonResponse(output, safe = False)
    output["message"] = "ERROR: LOGIN FAILURE, USER DOES NOT EXSIST"
    output["auth"] = False
    return JsonResponse(output, safe = False)
    # return None

# def get_user(self, user_id):
#     try:
#         return User.objects.get(pk=user_id)
#     except User.DoesNotExist:
#         return None
    
# def get_course(self, user_id):
#     try:
#         course = []
#         for ele in User.objects.get(pk = user_id).course_set.all().order_by('course_id'):
#             course.append(ele)
#             return JsonResponse(course, safe = False)
#     except User.DoesNotExist:
#         return JsonResponse("ERROR: User Does not Exsist", safe = False)

def login(request):
    output = {}
    output["message"] = "LOGIN SUCCESS"
    output["auth"] = True
    return JsonResponse(output, safe = False)
    