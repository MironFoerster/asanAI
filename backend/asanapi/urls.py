from django.urls import path
from . import views

urlpatterns = [
    path('dashboard-labs/', views.dashboard_labs),
    path('new-lab/', views.new_lab),
    path('share-lab/', views.share_lab),
    path('get-lab/<str:id>/', views.get_lab),
    path('sync-lab/<str:id>/', views.sync_lab),
    path('get-access/<str:id>/', views.get_lab_access),
    path('get-details/<str:tp>/', views.get_details),
]
