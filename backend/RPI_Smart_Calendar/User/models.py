
import django
from django.db import models
from django.contrib.auth.models import User
# class Group(models.Model):
#     group_id = models.CharField(max_length=30)
#     num_users = models.IntegerField()
#     #def __init__(self, name):
#         #self.name = name
#         #self.users = []
        
#     def __str__(self):
#         output = self.group_id + ": "
#         for ele in self.users:
#             output += str(ele)
#         return output
    
#     def add_user(self, new_user):
#         self.users.append(new_user)
#         self.users.sort()
        
#     def remove_user(self, user):
#         if self.users.index(user) == -1:
#             return ("ERROR: USER[{}] DOES NOT EXSIST".format(str(user)))
#         self.user.remove(user)
'''
class User(models.Model):
    rcs_id = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    #num_courses = models.IntegerField(default=0)
    def __str__(self):
        return self.rcs_id
    # group = models.ForeignKey(
    #     'Group'
    # )
'''

class Course(models.Model):
    course_id = models.CharField(max_length=30)
    course_name = models.CharField(max_length=120)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.course_id