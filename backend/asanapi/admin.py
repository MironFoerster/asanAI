from django.contrib import admin

from .models import Concept, DataPipe, DataSource, Lab, Lesson, Space, TFModel, Unit

admin.site.register(TFModel)
admin.site.register(DataSource)
admin.site.register(DataPipe)
admin.site.register(Lesson)
admin.site.register(Concept)
admin.site.register(Lab)
admin.site.register(Space)
admin.site.register(Unit)
