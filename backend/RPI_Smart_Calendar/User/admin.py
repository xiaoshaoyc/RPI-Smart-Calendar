from django.contrib import admin

from Calendar.models import Event
from .models import User
from Group.models import Course

class EventInline(admin.TabularInline):
    model = Event
    extra = 0
class CourseInline(admin.TabularInline):
    model = Course
    extra = 0
class UserAdmin(admin.ModelAdmin):
    inlines = [EventInline,CourseInline]
    list_display = ('username', 'first_name','last_name')

admin.site.register(User, UserAdmin)