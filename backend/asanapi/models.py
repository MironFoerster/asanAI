import uuid
from django.db import models
from auth_api.models import User


class TFModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    model_url = models.CharField(max_length=500)
    #lab
    #source_in_labs

class DataSource(models.Model):
    type = models.CharField(max_length=50)
    data_url = models.CharField(max_length=500)
    level = models.PositiveIntegerField()
    #used_in_pipes
    #recommended_in_lessons
    #choice_in_units

class DataPipe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name="used_in_pipes")
    pipe_spec = models.JSONField()
    #lab
    #source_in_labs

class Lesson(models.Model):
    thumbnail_url = models.CharField(max_length=500, default="assets/image-not-found.jpg")
    script_url = models.CharField(max_length=500)
    recommended_challenges = models.ManyToManyField(DataSource, related_name='recommended_in_lessons')
    #required_concepts
    #conveyed_concepts
    #used_in_units

class Concept(models.Model):
    name = models.CharField(max_length=50)
    conveyed_by = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='conveyed_concepts')
    required_for = models.ManyToManyField(Lesson, related_name='required_concepts')

class Lab(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, default="No Name")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="labs")
    model = models.OneToOneField(TFModel, on_delete=models.CASCADE, related_name="lab", null=True)
    pipe = models.OneToOneField(DataPipe, on_delete=models.CASCADE, related_name="lab", null=True)
    model_source = models.ForeignKey(TFModel, on_delete=models.CASCADE, related_name="source_in_labs", null=True)
    pipe_source = models.ForeignKey(DataPipe, on_delete=models.CASCADE, related_name="source_in_labs", null=True)
    public = models.BooleanField(default=False)
    #linked_units
    #shared_in_spaces
    shared_with_users = models.ManyToManyField(User, related_name="shared_labs") # like public lab but only for specific users

class Space(models.Model):
    type = models.CharField(max_length=50) # program, classroom, hackathon
    name = models.CharField(max_length=50)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="admin_in_spaces")
    users = models.ManyToManyField(User, related_name="member_in_spaces")
    allow_lab_help = models.BooleanField()
    allow_composit = models.BooleanField()
    allow_lab_sharing = models.BooleanField()
    require_min_lab_score = models.BooleanField()
    # ranked = models.BooleanField()
    # global = models.BooleanField()
    sequential = models.CharField(max_length=50) # enforce/suggest/none
    #units
    shared_labs = models.ManyToManyField(Lab, related_name='shared_in_spaces')

class Unit(models.Model):
    in_space = models.ForeignKey(Space, on_delete=models.CASCADE, related_name="units")
    order_index = models.PositiveIntegerField()
    linked_labs = models.ManyToManyField(Lab, related_name='linked_units')

    # will be theoretical/full lesson or challenge, based on which of the following fields is present
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="used_in_units", null=True)
    challenge_choices = models.ManyToManyField(DataSource, related_name='choice_in_units')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['in_space', 'order_index'], name='unique_unit_order')
        ]

