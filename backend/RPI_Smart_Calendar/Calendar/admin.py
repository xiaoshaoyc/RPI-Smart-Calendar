from django.contrib import admin

from .models import Event, Day, Week


class EventInline(admin.TabularInline):
    model = Event
    extra = 3

class DayAdmin(admin.ModelAdmin):
    # fieldsets = [
    #     (None,               {'fields': ['question_text']}),
    #     ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    # ]
    inlines = [EventInline]
    # list_display = ('question_text', 'pub_date', 'was_published_recently')
    # list_filter = ['pub_date']
    # search_fields = ['question_text']
admin.site.register(Day, DayAdmin)

class DayInline(admin.TabularInline):
    model = Day
    extra = 7

class WeekAdmin(admin.ModelAdmin):
    # fieldsets = [
    #     (None,               {'fields': ['question_text']}),
    #     ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    # ]
    inlines = [DayInline]
    # list_display = ('question_text', 'pub_date', 'was_published_recently')
    # list_filter = ['pub_date']
    # search_fields = ['question_text']

admin.site.register(Week, WeekAdmin)