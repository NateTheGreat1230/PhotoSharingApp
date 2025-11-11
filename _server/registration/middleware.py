from django.utils.deprecation import MiddlewareMixin
from django.core.signing import BadSignature, Signer
from django.utils import timezone
from gallery.models import TemporaryUser

signer = Signer()


class TemporaryUserMiddleware(MiddlewareMixin):
    def process_request(self, request):
        for key, value in request.COOKIES.items():
            if key.startswith("temp_user_"):
                try:
                    uid = signer.unsign(value)
                    temp_user = TemporaryUser.objects.get(uid=uid)
                    if not temp_user.is_expired():
                        request.temp_user = temp_user
                        return
                except Exception:
                    continue
