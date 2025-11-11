from django.utils import timezone
from datetime import timedelta
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password


def private_upload_path(instance, filename):
    return f"secure_uploads/{instance.album.uid}/{uuid.uuid4()}_{filename}"


class Album(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    uid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


class Image(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name="images")
    uid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    file = models.ImageField(upload_to=private_upload_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class SharedLink(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    uid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    passphrase = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_passphrase(self, raw):
        self.passphrase = make_password(raw)

    def check_passphrase(self, raw):
        return check_password(raw, self.passphrase)


class TemporaryUser(models.Model):
    sharedLink = models.ForeignKey(SharedLink, on_delete=models.CASCADE)
    uid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=1)
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expires_at
