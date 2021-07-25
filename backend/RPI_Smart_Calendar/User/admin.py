from django.contrib import admin

from Calendar.models import Event
from .models import User
from Group.models import MyGroup
class EventInline(admin.TabularInline):
    model = Event
    extra = 0
class UserAdmin(admin.ModelAdmin):
    inlines = [EventInline]
    list_display = ('username', 'first_name','last_name')

admin.site.register(User, UserAdmin)