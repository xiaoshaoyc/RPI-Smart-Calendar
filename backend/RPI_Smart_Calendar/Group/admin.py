from django.contrib import admin

from .models import Course

class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_id', 'course_name','user')
admin.site.register(Course,CourseAdmin)
