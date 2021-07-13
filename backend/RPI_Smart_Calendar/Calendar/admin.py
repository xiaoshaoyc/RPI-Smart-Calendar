from django.contrib import admin

from .models import Event, Day, Week

admin.site.register(Event)
class EventInline(admin.TabularInline):
    model = Event
    extra = 3

class DayAdmin(admin.ModelAdmin):
    inlines = [EventInline]
    search_fields = ['day_number']
admin.site.register(Day, DayAdmin)

class DayInline(admin.TabularInline):
    model = Day
    extra = 7

class WeekAdmin(admin.ModelAdmin):

    inlines = [DayInline]
    search_fields = ['week_number']

admin.site.register(Week, WeekAdmin)