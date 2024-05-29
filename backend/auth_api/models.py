from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    completed_lessons = models.ManyToManyField("asanapi.Lesson", related_name='completed_users', blank=True)
    learned_concepts = models.ManyToManyField("asanapi.Concept", related_name='learned_users', blank=True)
    #labs
    #shared_labs
    #member_in_spaces
    #admin_in_spaces