from django.http.response import JsonResponse
from django.contrib.auth.hashers import check_password
from django.views import View
from .models import User

class LogoutView(View):
    def get(self, request):
        try:
            del request.session['user_id']
            request.session.flush()
        except KeyError:
            pass
        output = 'logout'
        return JsonResponse(output, safe=False)

class AuthenticateView(View):
    def get(self, request):
        # username = request.POST["username"]
        # password = request.POST["password"]
        username = 'harry123'
        password = '123456'
        output = {}
        try:
            user = User.objects.get(username=username)
            hashpassword = user.password
            if check_password(password, hashpassword):
                output["message"] = "LOGIN SUCCESS"
                output["auth"] = True
                request.session['user_id'] = user.id
            else:
                output["message"] = "ERROR: LOGIN FAILURE, WRONG PASSWORD"
                output["auth"] = False
        except User.DoesNotExist:
            output["message"] = "ERROR: LOGIN FAILURE, USER DOES NOT EXSIST"
            output["auth"] = False
        return JsonResponse(output, safe=False)

