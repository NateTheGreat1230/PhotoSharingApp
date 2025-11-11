from functools import wraps
from django.shortcuts import redirect
from django.core.signing import Signer
from gallery.models import TemporaryUser

signer = Signer()


def allow_temp_user(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated or hasattr(request, "temp_user"):
            return view_func(request, *args, **kwargs)
        # Neither normal nor temp user, redirect
        return redirect("/registration/sign_in/")

    return wrapper
