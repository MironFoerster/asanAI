from django.urls import path
from . import views

urlpatterns = [
    path('dashboard-labs/', views.dashboard_labs),
    path('new-lab/', views.new_lab),
    path('share-lab/', views.share_lab),
    path('get-lab-data/<str:id>/<int:v>/', views.get_lab_data),
    path('get-lab-data/<str:id>/', views.get_lab_data),
    path('sync-lab/<str:id>/', views.sync_lab),
    path('save-version/<str:id>/<str:message>/', views.save_version),
    path('lab-authorization/<str:id>/', views.lab_authorization),
    path('get-details/<str:tp>/', views.get_details),
    path('save-model/<str:id>/<str:v>/', views.save_model),
    path('save-model/<str:id>/', views.save_model),
]
