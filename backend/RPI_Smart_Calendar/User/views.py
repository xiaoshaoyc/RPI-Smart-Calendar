from django.http import HttpResponse
from django import http
from django.db.models.base import Model
from django.http.response import Http404, JsonResponse

from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import User


def logout(request):
    try:
        del request.session['user_id']
        request.session.flush()
    except KeyError:
        pass
    output = ['pass']
    return JsonResponse(output, safe = False)

def authenticate(request):
    # username = request.POST["username"]
    # password = request.POST["password"]
    username = 'harry123'
    password = '123456'
    output = {}
    try:
        user = User.objects.get(username=username)
        hashpassword = user.password
        if check_password(password,hashpassword):
            output["message"] = "LOGIN SUCCESS"
            output["auth"] = True
            request.session['user_id'] = user.id
        else:
            output["message"] = "ERROR: LOGIN FAILURE, WRONG PASSWORD"
            output["auth"] = False
    except User.DoesNotExist:
        # Create a new user. There's no need to set a password
        # because only the password from settings.py is checked.
        output["message"] = "ERROR: LOGIN FAILURE, USER DOES NOT EXSIST"
        output["auth"] = False
    return JsonResponse(output, safe = False)
    
