from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Album, Image
import json


@login_required
def albums(request):
    if request.method == "GET":
        albums = [
            {
                "uid": str(album.uid),
                "title": album.title,
                "owner": album.owner.username,
                "created_at": album.created_at.isoformat(),
            }
            for album in request.user.album_set.all()
        ]
        print(albums)
        return JsonResponse({"albums": albums}, status=200)

    elif request.method == "POST":
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        title = body.get("title")
        if not title:
            return JsonResponse({"error": "Title is required"}, status=400)
        album = Album.objects.create(owner=request.user, title=title)
        return JsonResponse(
            {
                "album": {
                    "uid": str(album.uid),
                    "title": album.title,
                    "owner": album.owner.username,
                    "created_at": album.created_at.isoformat(),
                }
            },
            status=201,
        )
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


@login_required
def get_album(request, uid):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        album = Album.objects.get(uid=uid)
    except Album.DoesNotExist:
        return JsonResponse({"error": "Album not found"}, status=404)
    if album.owner != request.user:
        return JsonResponse({"error": "Unauthorized"}, status=403)
    images = [
        {
            "uid": str(img.uid),
            "album": str(img.album.uid),
            "file": img.file.url if img.file else None,
            "uploaded_at": img.uploaded_at.isoformat(),
        }
        for img in album.images.all()
    ]
    return JsonResponse(
        {
            "album": {
                "uid": str(album.uid),
                "owner": album.owner.username,
                "title": album.title,
                "created_at": album.created_at.isoformat(),
            },
            "images": images,
        },
        status=200,
    )


@login_required
def upload_image(request, uid):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        album = Album.objects.get(uid=uid)
    except Album.DoesNotExist:
        return JsonResponse({"error": "Album not found"}, status=404)
    if album.owner != request.user:
        return JsonResponse({"error": "Unauthorized"}, status=403)
    uploaded_file = request.FILES.get("file")
    if not uploaded_file:
        return JsonResponse({"error": "No file provided"}, status=400)
    image = Image.objects.create(album=album, file=uploaded_file)
    return JsonResponse(
        {
            "image": {
                "uid": str(image.uid),
                "album": str(image.album.uid),
                "file": image.file.url if image.file else None,
                "uploaded_at": image.uploaded_at.isoformat(),
            },
        },
        status=201,
    )
