import uuid
from django.db import models
from django.contrib.auth.models import User


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
