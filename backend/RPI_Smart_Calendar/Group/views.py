from django.shortcuts import render
from django.http.response import Http404, JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from User.models import User
# Create your views here.
def get_course(request):
    user_id = request.session.get('user_id', None)
    if user_id:
        user = User.objects.get(id=user_id)
    else:
        return HttpResponseRedirect(reverse('User:authenticate'))
    courses = user.course_set.all()
    output = []
    for course in courses:
        output.append(course.course_id)
    return JsonResponse(output, safe = False)