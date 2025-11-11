from django.urls import path
from . import views

urlpatterns = [
    path("sign_in/", views.sign_in),
    path("sign_up/", views.sign_up),
    path("logout/", views.logout_view),
    # path("enter_passphrase/<uuid:uid>/", views.enter_passphrase),
    path("enter_passphrase/", views.enter_passphrase),
    path("auth/user_type/", views.get_user_type),
]
