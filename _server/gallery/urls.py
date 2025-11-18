from django.urls import path
from . import views

urlpatterns = [
    path("user/profile_data/", views.get_profile_data, name="get_profile_data"),
    path("albums/", views.albums, name="albums"),
    path("albums/<uuid:uid>/", views.get_album, name="get_album"),
    path("albums/<uuid:uid>/delete/", views.delete_album, name="delete_album"),
    path(
        "albums/<uuid:uid>/share/", views.create_shared_link, name="create_shared_link"
    ),
    path("albums/<uuid:uid>/unshare/", views.delete_shared, name="delete_shared"),
    path("albums/<uuid:uid>/images/", views.upload_images, name="upload_images"),
    path("images/<uuid:uid>/", views.get_image, name="get_image"),
    path("images/<uuid:uid>/delete/", views.delete_image, name="delete_image"),
    path("shared/<uuid:uid>/", views.get_shared, name="get_shared"),
    path(
        "shared/<uuid:uid>/images/",
        views.upload_shared_images,
        name="upload_shared_images",
    ),
    path(
        "shared/<uuid:uid>/images/<uuid:image_uid>/",
        views.get_shared_image,
        name="get_shared_image",
    ),
    path(
        "shared/<uuid:uid>/images/<uuid:image_uid>/delete/",
        views.delete_shared_image,
        name="delete_shared_image",
    ),
]
