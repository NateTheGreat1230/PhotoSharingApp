from django.urls import path
from . import views

urlpatterns = [
    path("sign_in/", views.sign_in),
    path("sign_up/", views.sign_up),
    path("logout/", views.logout_view),
    path(
        "shared/<uuid:uid>/authenticate/",
        views.enter_passphrase,
        name="enter_passphrase",
    ),
    path("auth/user_type/", views.get_user_type),
    path("auth/get_user/", views.get_user),
]
