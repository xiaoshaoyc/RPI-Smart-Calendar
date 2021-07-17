from django.db import models
from django.conf import settings
# Create your models here.
class Course(models.Model):
    course_id = models.CharField(max_length=30)
    course_name = models.CharField(max_length=120)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    def __str__(self):
        return self.course_id