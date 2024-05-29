from django.contrib import admin

from .models import Concept, Pipe, Data, Lab, Lesson, Space, TFModel, Unit

admin.site.register(TFModel)
admin.site.register(Data)
admin.site.register(Pipe)
admin.site.register(Lesson)
admin.site.register(Concept)
admin.site.register(Lab)
admin.site.register(Space)
admin.site.register(Unit)
