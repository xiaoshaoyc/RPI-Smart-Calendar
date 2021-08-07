from django.http.response import JsonResponse
from django.contrib.auth.hashers import check_password
from django.views import View
from .models import User

# the class would log the user out of the group
class Logout(View):
    def get(self, request):
        try:
            del request.session['user_id']
            request.session.flush()
        except KeyError:
            pass
        output = 'logout'
        return JsonResponse(output, safe=False)
# the class would check whether the received username and password are true
# if pass the authentiation, login the user
# else return fail message
class Authenticate(View):
    def get(self, request):
        # username = request.POST["username"]
        # password = request.POST["password"]
        username = 'harry123'
        password = '123456'
        output = {}
        # try to get the user within the database
        try:
            user = User.objects.get(username=username)
            hashpassword = user.password
            if check_password(password, hashpassword):
                output["message"] = "LOGIN SUCCESS"
                output["auth"] = True
                request.session['user_id'] = user.id
                return JsonResponse(status=200, data = output, safe=False)
            # invalid password
            else:
                output["message"] = "ERROR: LOGIN FAILURE, WRONG PASSWORD"
                output["auth"] = False
                return JsonResponse(status=500, data = output, safe=False)
        # invalid username
        except User.DoesNotExist:
            output["message"] = "ERROR: LOGIN FAILURE, USER DOES NOT EXSIST"
            output["auth"] = False
        return JsonResponse(status=500, data = output, safe=False)
