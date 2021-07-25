from django.contrib import admin
from .models import MyGroup, Message
class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
class GroupAdmin(admin.ModelAdmin):
    inlines = [MessageInline]
    list_display = ('group_id', 'name')

admin.site.register(MyGroup, GroupAdmin)