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
    def post(self, request):
        username = request.POST["username"]
        password = request.POST["password"]
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


# register the user
class Register(View):
    def get(self, request):
        # email = request.POST["email"]
        # username = request.POST["username"]
        # password = request.POST["password"]
        # repeat = request.POST["repeat"]
        username = 'harry1234'
        password = '123456'
        repeat = '123456'
        email = 'harry1234@rpi.edu'
        output = {}
        # different passwords
        if(password != repeat):
            output["message"] = "ERROR: USER EXIST"
            output["auth"] = False
            return JsonResponse(status=500, data = output, safe=False)
        # try to get the user within the database
        try:
            user = User.objects.get(username=username)
            output["message"] = "ERROR: USER EXIST"
            output["auth"] = False
            return JsonResponse(status=500, data = output, safe=False)
        # user not exit
        except User.DoesNotExist:
            # save the user
            user = User(username=username, email = email)
            user.set_password(password)
            user.save()
        output["message"] = "SUCCESS: USER REGISTERED"
        output["auth"] = True
        return JsonResponse(status=200, data = output, safe=False)

