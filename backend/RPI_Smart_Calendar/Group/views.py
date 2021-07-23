from django.http.response import JsonResponse
from django.views import View
from User.models import User
# Create your views here.

class DisplayCourses(View):
    def get(self,request):
        output = {}
        data = []
        output['data'] = data
        # get user
        user_id = request.session.get('user_id', None)
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: PLEASE LOGIN'
            return JsonResponse(status=401, data = output, safe=False)
        # get course
        courses = user.course_set.all()
        for course in courses:
            data.append(course.group.group_id)
        output["isSuccess"] = True
        output["Messgae"] = 'SUCCESS'
        return JsonResponse(status=200, data = output, safe=False)
class ReceiveMessage(View):
    def get(self,request):
        pass
class MessageView(View):
    def get(self,request):
        pass
class DisplayUsers(View):
    def get(self,request):
        pass