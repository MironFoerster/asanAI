from rest_framework import serializers
from .models import Concept, LabVersion, Pipe, Data, Lab, Lesson, PipeVersion, Space, TFModel, TFModelVersion, Trainer, TrainerVersion, Unit

class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data
        fields = '__all__'

class LabSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = ["id", "name"]

class TFModelSourceSerializer(serializers.ModelSerializer):
    lab = LabSourceSerializer()
    class Meta:
        model = TFModel
        fields = ["id", "name", "lab"]

class TFModelDetailsSerializer(serializers.ModelSerializer):
    model_source = TFModelSourceSerializer()
    class Meta:
        model = TFModel
        fields = '__all__'

class TFModelSerializer(serializers.ModelSerializer):
    version = serializers.SerializerMethodField()

    class Meta:
        model = TFModel
        fields = '__all__'

    def get_version(self, obj):
        if self.context["version"] > 0:
            return TFModelVersionSerializer(obj.versions.get(v=self.context["version"])).data
        else:
            return {"v": 0}
        
class TFModelVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TFModelVersion
        fields = '__all__'

class PipeSourceSerializer(serializers.ModelSerializer):
    lab = LabSourceSerializer()
    class Meta:
        model = Pipe
        fields = ["id", "name", "lab"]

class PipeDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pipe
        fields = '__all__'

class PipeSerializer(serializers.ModelSerializer):
    version = serializers.SerializerMethodField()

    class Meta:
        model = Pipe
        fields = '__all__'

    def get_version(self, obj):
        if self.context["version"] > 0:
            return PipeVersionSerializer(obj.versions.get(v=self.context["version"])).data
        else:
            return {"v": 0}

class PipeVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PipeVersion
        fields = '__all__'

class TrainerSerializer(serializers.ModelSerializer):
    version = serializers.SerializerMethodField()

    class Meta:
        model = Trainer
        fields = '__all__'

    def get_version(self, obj):
        if self.context["version"] > 0:
            return TrainerVersionSerializer(obj.versions.get(v=self.context["version"])).data
        else:
            return {"v": 0}
        
class TrainerVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerVersion
        fields = '__all__'

class LabSerializer(serializers.ModelSerializer):
    authorization = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    version = serializers.SerializerMethodField()

    class Meta:
        model = Lab
        fields = '__all__'

    def get_authorization(self, obj):
        user = self.context['request'].user
        print(user)
        print(obj.user)
        if user == obj.user:
            return "owning"
        elif user in obj.shared_with_users.all() or obj.public:
            return "viewing"
        else:
            return "none"
        
    def get_username(self, obj):
        return obj.user.username
    
    def get_version(self, obj):
        if self.context["version"] > 0:
            return LabVersionSerializer(obj.versions.get(v=self.context["version"])).data
        else:
            return None

class LabVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabVersion
        fields = '__all__'

class LabDetailsSerializer(serializers.ModelSerializer):
    model_source = TFModelSourceSerializer()
    pipe_source = PipeSourceSerializer()
    authorization = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Lab
        fields = '__all__'

    def get_authorization(self, obj):
        user = self.context['request'].user
        print(user)
        print(obj.user)
        if user == obj.user:
            return "owning"
        elif user in obj.shared_with_users.all() or obj.public:
            return "viewing"
        else:
            return "none"
        
    def get_username(self, obj):
        return obj.user.username

class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = '__all__'

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'

class ConceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concept
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'