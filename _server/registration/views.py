from django.utils import timezone
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse
from django.core.signing import Signer
from gallery.models import SharedLink, TemporaryUser

signer = Signer()


# Create your views here.
def sign_up(req):
    if req.method == "POST":
        user = User.objects.create_user(
            username=req.POST.get("email"),
            password=req.POST.get("password"),
            email=req.POST.get("email"),
            first_name=req.POST.get("first_name"),
            last_name=req.POST.get("last_name"),
        )
        login(req, user)
        return redirect("/")
    else:
        return render(req, "registration/sign_up.html")


def sign_in(req):
    if req.method == "POST":
        user = authenticate(
            req, username=req.POST.get("email"), password=req.POST.get("password")
        )
        if user is not None:
            login(req, user)
            return redirect("/")

        return render(req, "registration/sign_in.html")
    else:
        if hasattr(req, "temp_user") and req.temp_user:
            pass
        return render(req, "registration/sign_in.html")


def get_user_type(request):
    if request.user.is_authenticated:
        return JsonResponse({"user_type": "registered"}, status=200)
    elif hasattr(request, "temp_user") and request.temp_user is not None:
        return JsonResponse({"user_type": "temporary"}, status=200)
    else:
        return JsonResponse({"user_type": "anonymous"}, status=200)


def logout_view(request):
    logout(request)
    return JsonResponse({"success": True})


def enter_passphrase(request, uid):
    TemporaryUser.objects.filter(expires_at__lt=timezone.now()).delete()
    if request.method == "POST":
        passphrase = request.POST.get("passphrase")
        if passphrase:
            sharedLink = SharedLink.objects.get(uid=uid)
            if sharedLink.check_passphrase(passphrase):
                tempUser = TemporaryUser.objects.create(sharedLink=sharedLink)
                token = signer.sign(str(tempUser.uid))
                response = redirect(f"/shared/?album={sharedLink.uid}/")
                response.set_cookie(
                    f"temp_user_{tempUser.uid}", token, max_age=24 * 3600
                )
                return response
            else:
                return render(
                    request,
                    "registration/enter_passphrase.html",
                    {"error": "Incorrect passphrase."},
                )

        else:
            return JsonResponse({"error": "Passphrase is required"}, status=400)
    return render(request, "registration/enter_passphrase.html", {"uid": uid})
