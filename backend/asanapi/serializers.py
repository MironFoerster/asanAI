from rest_framework import serializers
from .models import Concept, DataPipe, DataSource, Lab, Lesson, Space, TFModel, Unit

class TFModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TFModel
        fields = '__all__'

class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = '__all__'

class DataPipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataPipe
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class ConceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concept
        fields = '__all__'


class LabSerializer(serializers.ModelSerializer):
    access_level = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Lab
        fields = '__all__'

    def get_access_level(self, obj):
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
