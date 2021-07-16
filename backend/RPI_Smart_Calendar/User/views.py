from django.http import HttpResponse
from django import http
from django.db.models.base import Model
from django.http.response import Http404, JsonResponse

from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User

def register(request):
    user = [["Zeyu","Wang","wangz45","wangz45"],
                ["Harry","Sui","harry123","123456"]]
    courses = [[],
                []]
    user = User(username=settings.ADMIN_LOGIN)
    user.is_staff = True
    user.is_superuser = True
    user.save()

def authenticate(request):
    username = request.POST["username"]
    password = request.POST["password"]
    login_valid = (settings.ADMIN_LOGIN == username)
    pwd_valid = (settings.ADMIN_PASSWORD == password)
    output = {}
    if login_valid and pwd_valid:
        try:
            user = User.objects.get(username=username)
            for index in range(len(settings.ADMIN_COURSE)):
                user.course_set.create(course_id = "CSCI-000{}".format(index), 
                                        course_name = settings.ADMIN_COURSE[index])
            output["message"] = "LOGIN SUCCESS"
            output["auth"] = True
            return JsonResponse(output, safe = False)
        except User.DoesNotExist:
            # Create a new user. There's no need to set a password
            # because only the password from settings.py is checked.
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

def login(request):
    output = {}
    output["message"] = "LOGIN SUCCESS"
    output["auth"] = True
    return JsonResponse(output, safe = False)
    
def get_course(request):
    output = settings.ADMIN_COURSE
    return JsonResponse(output, safe = False)
