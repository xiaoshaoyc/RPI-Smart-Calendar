from django.contrib import admin

from .models import MyGroup, Course, Message

class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
class CourseInline(admin.TabularInline):
    model = Course
    extra = 0
class GroupAdmin(admin.ModelAdmin):
    inlines = [MessageInline,CourseInline]
    list_display = ('group_id', 'name')

admin.site.register(MyGroup, GroupAdmin)