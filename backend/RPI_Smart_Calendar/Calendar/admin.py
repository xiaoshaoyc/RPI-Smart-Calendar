from django.contrib import admin

from .models import Event, Day, Week, Year


class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
admin.site.register(Event,EventAdmin)


class EventInline(admin.TabularInline):
    model = Event
    extra = 3

class DayAdmin(admin.ModelAdmin):
    inlines = [EventInline]
    list_display = ('day_number', 'get_day_number_display','week')
    search_fields = ['day_number']
admin.site.register(Day, DayAdmin)

class DayInline(admin.TabularInline):
    model = Day
    extra = 7

class WeekAdmin(admin.ModelAdmin):

    inlines = [DayInline]
    list_display = ('pk', 'week_number')
    search_fields = ['week_number']

admin.site.register(Week, WeekAdmin)

class WeekInline(admin.TabularInline):
    model = Week
    extra = 3

class YearAdmin(admin.ModelAdmin):
    inlines = [WeekInline]
    list_display = ('pk', 'year_number')
    search_fields = ['year_number']

admin.site.register(Year, YearAdmin)
# admin.site.register(Year)