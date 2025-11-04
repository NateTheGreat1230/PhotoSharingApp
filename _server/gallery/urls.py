from django.urls import path
from . import views

urlpatterns = [
    path("albums/", views.albums, name="albums"),
    path("albums/<uuid:uid>/", views.get_album, name="get_album"),
    path("albums/<uuid:uid>/images/", views.upload_image, name="upload_image"),
    path("images/<uuid:uid>/", views.get_image, name="get_image"),
]
