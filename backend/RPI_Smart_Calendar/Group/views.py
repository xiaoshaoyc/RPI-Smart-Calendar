from django.http.response import JsonResponse
from django.views import View
from User.models import User
from .models import Message, MyGroup

# the class return courses of of the user
# return fail message if not login
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
        # get group
        groups = user.groups.all()
        for group in groups:
            data.append(group.group_id)
        output["isSuccess"] = True
        output["Messgae"] = 'SUCCESS'
        return JsonResponse(status=200, data = output, safe=False)

# the class whould save the received message sent by the user
# return fail message if not login
# return fail message if group not exist
class ReceiveMessage(View):
    def post(self,request,group_id):
        output = {}
        user_id = request.session.get('user_id', None)
        text = request.POST["text"]
        #get user
        try:
            user = User.objects.get(id=user_id)
        except:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: USER NOT LOGIN'
            return JsonResponse(status=500, data = output, safe=False)
        #get the group
        try:
            group = MyGroup.objects.get(group_id = group_id)
        except:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: GROUP NOT EXIST'
            return JsonResponse(status=500, data = output, safe=False)
        #save message
        message = Message(user = user, group = group, text = text)
        message.save()
        output["isSuccess"] = True
        output["Messgae"] = 'SUCCESS: MESSAGE SAVED'
        return JsonResponse(status=200, data = output, safe=False)

# the class would return all messages of the group
# return fail message if group not exist
class DisplayMessages(View):
    def get(self,request,group_id):
        output = {}
        data = []
        output["data"] = data
        #get the group
        try:
            group = MyGroup.objects.get(group_id = group_id)
        except:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: GROUP NOT EXIST'
            return JsonResponse(status=500, data = output, safe=False)
        #return all messages
        for message in group.message_set.all():
            messageinfo = {}
            #get sender
            user = message.user
            userinfo = {}
            userinfo['username'] = user.username
            userinfo['last_name'] = user.last_name
            userinfo['first_name'] = user.first_name
            #save
            messageinfo['sender'] = userinfo
            messageinfo['text'] = message.text
            messageinfo['time'] = message.time
            data.append(messageinfo)
        output["isSuccess"] = True
        output["Messgae"] = 'SUCCESS: MESSAGES RETURNED'
        return JsonResponse(status=200, data = output, safe=False)

# the class would return users of the group
# return fail message if group not exist
class DisplayUsers(View):
    def get(self,request,group_id):
        output = {}
        data = []
        output["data"] = data
        #get the group
        try:
            group = MyGroup.objects.get(group_id = group_id)
        except:
            output["isSuccess"] = False
            output["Messgae"] = 'FAIL: GROUP NOT EXIST'
            return JsonResponse(status=500, data = output, safe=False)
        #save all the users
        for user in group.user_set.all():
            userinfo = {}
            userinfo['username'] = user.username
            userinfo['last_name'] = user.last_name
            userinfo['first_name'] = user.last_name
            data.append(userinfo)
        output["isSuccess"] = True
        output["Messgae"] = 'SUCCESS: USERS RETURNED'
        return JsonResponse(status=200, data = output, safe=False)

