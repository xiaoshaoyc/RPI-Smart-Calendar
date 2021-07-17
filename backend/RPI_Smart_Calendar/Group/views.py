from django.http.response import JsonResponse
from User.models import User
# Create your views here.


def get_course(request):
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
        return JsonResponse(output, safe=False)
    # get course
    courses = user.course_set.all()
    for course in courses:
        data.append(course.course_id)
    output["isSuccess"] = True
    output["Messgae"] = 'SUCCESS'
    return JsonResponse(output, safe=False)
