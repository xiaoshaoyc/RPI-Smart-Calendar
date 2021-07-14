from django.contrib import admin

from .models import Course, User

'''
class UserAdmin(admin.ModelAdmin):
    fields = ['rcs_id', 'first_name','last_name']
'''

class CourseAdmin(admin.ModelAdmin):
    fields = ['course_id','course_name']

class CourseInline(admin.TabularInline):
    model = Course
    extra = 8
#admin.site.register(User, UserAdmin)
admin.site.register(Course)