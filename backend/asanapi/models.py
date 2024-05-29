import uuid
from django.db import models
from auth_api.models import User


class TFModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, default="Unnamed")
    latest_v = models.IntegerField(default=0)
    #lab
    #versions

class TFModelVersion(models.Model):
    model = models.ForeignKey(TFModel, on_delete=models.CASCADE, related_name="versions")
    v = models.IntegerField(default=0)
    #source_in_labs

class Data(models.Model):
    category = models.CharField(max_length=50, null=True)
    source = models.CharField(max_length=50, null=True)
    data_url = models.CharField(max_length=500, null=True)
    level = models.PositiveIntegerField(default=0)
    #used_in_pipes
    #recommended_in_lessons
    #choice_in_units

class DataVersion(models.Model):
    source = models.CharField(max_length=50, null=True)
    data_url = models.CharField(max_length=500, null=True)
    level = models.PositiveIntegerField(default=0)
    #used_in_pipes
    #recommended_in_lessons
    #choice_in_units

class Pipe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, default="Unnamed")
    latest_v = models.IntegerField(default=0)
    data = models.ForeignKey(Data, on_delete=models.CASCADE, related_name="used_in_pipes")
    preprocs = models.JSONField(default=list)
    postprocs = models.JSONField(default=list)
    #lab
    #versions

class PipeVersion(models.Model):
    pipe = models.ForeignKey(Pipe, on_delete=models.CASCADE, related_name="versions")
    v = models.IntegerField()
    data = models.ForeignKey(Data, on_delete=models.CASCADE, related_name="used_in_pipe_versions")
    preprocs = models.JSONField(default=list)
    postprocs = models.JSONField(default=list)
    #source_in_labs

class Trainer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    latest_v = models.IntegerField(default=0)
    epochs = models.IntegerField(default=10)
    split = models.IntegerField(default=10)
    batchSize = models.IntegerField(default=10)
    optimizer = models.CharField(default="adam")
    loss = models.CharField(default="meanSquaredError")
    optParams = models.JSONField(default=list)
    #lab
    #versions

class TrainerVersion(models.Model):
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE, related_name="versions")
    v = models.IntegerField()
    latest_v = models.IntegerField(default=0)
    epochs = models.IntegerField(default=10)
    split = models.IntegerField(default=10)
    batchSize = models.IntegerField(default=10)
    optimizer = models.CharField(default="adam")
    loss = models.CharField(default="meanSquaredError")
    optParams = models.JSONField(default=list)
    #trainer_in_labs

class Lesson(models.Model):
    thumbnail_url = models.CharField(max_length=500, default="assets/image-not-found.jpg")
    script_url = models.CharField(max_length=500)
    recommended_challenges = models.ManyToManyField(Data, related_name='recommended_in_lessons')
    #required_concepts
    #conveyed_concepts
    #used_in_units

class Concept(models.Model):
    name = models.CharField(max_length=50)
    conveyed_by = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='conveyed_concepts')
    required_for = models.ManyToManyField(Lesson, related_name='required_concepts')

class Lab(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, default="Unnamed")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="labs")
    latest_v = models.IntegerField(default=0)
    pipe = models.OneToOneField(Pipe, on_delete=models.CASCADE, related_name="lab", null=True)
    model = models.OneToOneField(TFModel, on_delete=models.CASCADE, related_name="lab", null=True)
    trainer = models.OneToOneField(Trainer, on_delete=models.CASCADE, related_name="lab", null=True)
    model_source = models.ForeignKey(TFModelVersion, on_delete=models.CASCADE, related_name="source_in_labs", null=True)
    pipe_source = models.ForeignKey(PipeVersion, on_delete=models.CASCADE, related_name="source_in_labs", null=True)
    public = models.BooleanField(default=False)
    #linked_units
    #shared_in_spaces
    shared_with_users = models.ManyToManyField(User, related_name="shared_labs") # like public lab but only for specific users

class LabVersion():
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name="versions")
    v = models.IntegerField()
    commit_message = models.CharField(max_length=300)
    timestamp = models.DateTimeField(auto_now_add=True)

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
    challenge_choices = models.ManyToManyField(Data, related_name='choice_in_units')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['in_space', 'order_index'], name='unique_unit_order')
        ]

