from django.contrib import admin

from Calendar.models import Event
from .models import User, Course


class EventInline(admin.TabularInline):
    model = Event
    extra = 3
class CourseInline(admin.TabularInline):
    model = Course
    extra = 3
class UserAdmin(admin.ModelAdmin):
    inlines = [EventInline,CourseInline]
    list_display = ('username', 'first_name')

admin.site.register(User, UserAdmin)