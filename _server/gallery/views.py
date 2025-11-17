from django.http import FileResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from registration.decorators import allow_temp_user
from .models import Album, Image, SharedLink
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
            "file": f"/gallery/images/{img.uid}/",
            "uploaded_at": img.uploaded_at.isoformat(),
        }
        for img in album.images.all()
    ]
    shared = SharedLink.objects.filter(album=album)
    is_shared = shared.exists()

    return JsonResponse(
        {
            "album": {
                "uid": str(album.uid),
                "owner": f"{album.owner.first_name} {album.owner.last_name}",
                "title": album.title,
                "created_at": album.created_at.isoformat(),
            },
            "images": images,
            "is_shared": is_shared,
            "shared_link": (
                {
                    "uid": str(shared[0].uid),
                    "created_at": shared[0].created_at.isoformat(),
                    "link": f"/registration/shared/{shared[0].uid}/authenticate/",
                }
                if is_shared
                else None
            ),
        },
        status=200,
    )


@login_required
def delete_album(request, uid):
    if request.method != "DELETE":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        album = Album.objects.get(uid=uid)
    except Album.DoesNotExist:
        return JsonResponse({"error": "Album not found"}, status=404)
    if album.owner != request.user:
        return JsonResponse({"error": "Unauthorized"}, status=403)
    album.delete()
    return JsonResponse({"message": "Album deleted"}, status=200)


@login_required
def upload_images(request, uid):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        album = Album.objects.get(uid=uid)
    except Album.DoesNotExist:
        return JsonResponse({"error": "Album not found"}, status=404)
    if album.owner != request.user:
        return JsonResponse({"error": "Unauthorized"}, status=403)
    files = request.FILES.getlist("files")
    if not files:
        return JsonResponse({"error": "No files provided"}, status=400)
    uploaded = []
    failed = []
    for f in files:
        try:
            img = Image.objects.create(album=album, file=f)
            uploaded.append(
                {
                    "uid": str(img.uid),
                    "file": img.file.url,
                    "uploaded_at": img.uploaded_at.isoformat(),
                }
            )
        except Exception as e:
            failed.append({"filename": f.name, "error": str(e)})
    return JsonResponse(
        {
            "success_count": len(uploaded),
            "fail_count": len(failed),
            "uploaded": uploaded,
            "failed": failed,
        },
        status=207 if failed else 201,
    )


@login_required
def get_image(request, uid):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        image = Image.objects.get(uid=uid)
    except Image.DoesNotExist:
        return JsonResponse({"error": "Image not found"}, status=404)
    if image.album.owner != request.user:
        return JsonResponse({"error": "Unauthorized"}, status=403)
    return FileResponse(image.file.open("rb"), as_attachment=False)


@login_required
def create_shared_link(request, uid):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        album = Album.objects.get(uid=uid)
    except Album.DoesNotExist:
        return JsonResponse({"error": "Album not found"}, status=404)
    if album.owner != request.user:
        return JsonResponse({"error": "Unauthorized"}, status=403)
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    passphrase = body.get("passphrase")
    if not passphrase:
        return JsonResponse({"error": "Passphrase is required"}, status=400)
    if SharedLink.objects.filter(album=album).exists():
        return JsonResponse({"error": "Shared link already exists"}, status=400)
    shared_link = SharedLink(album=album)
    shared_link.set_passphrase(passphrase)
    shared_link.save()
    return JsonResponse(
        {
            "shared_link": {
                "uid": str(shared_link.uid),
                "created_at": shared_link.created_at.isoformat(),
                "link": f"/registration/shared/{shared_link.uid}/authenticate/",
            }
        },
        status=201,
    )


@login_required
def delete_shared(request, uid):
    if request.method != "DELETE":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        album = Album.objects.get(uid=uid)
    except Album.DoesNotExist:
        return JsonResponse({"error": "Album not found"}, status=404)
    if album.owner != request.user:
        return JsonResponse({"error": "Unauthorized"}, status=403)
    try:
        shared_link = SharedLink.objects.get(album=album)
    except SharedLink.DoesNotExist:
        return JsonResponse({"error": "Shared link not found"}, status=404)
    shared_link.delete()
    return JsonResponse({"message": "Shared link deleted"}, status=200)


# Additional view functions for shared links
@allow_temp_user
def get_shared(request, uid):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        shared_link = SharedLink.objects.get(uid=uid)
    except SharedLink.DoesNotExist:
        return JsonResponse({"error": "Shared link not found"}, status=404)
    images = [
        {
            "uid": str(img.uid),
            "album": str(img.album.uid),
            "file": f"/gallery/shared/{shared_link.uid}/images/{img.uid}/",
            "uploaded_at": img.uploaded_at.isoformat(),
        }
        for img in shared_link.album.images.all()
    ]
    return JsonResponse(
        {
            "shared_link": {
                "uid": str(shared_link.uid),
                "album": str(shared_link.album.uid),
                "created_at": shared_link.created_at.isoformat(),
            },
            "album": {
                "uid": str(shared_link.album.uid),
                "title": shared_link.album.title,
                "owner": f"{shared_link.album.owner.first_name} {shared_link.album.owner.last_name}",
                "created_at": shared_link.album.created_at.isoformat(),
            },
            "images": images,
        },
        status=200,
    )


@allow_temp_user
def upload_shared_images(request, uid):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        shared_link = SharedLink.objects.get(uid=uid)
    except SharedLink.DoesNotExist:
        return JsonResponse({"error": "Shared link not found"}, status=404)
    files = request.FILES.getlist("files")
    if not files:
        return JsonResponse({"error": "No files provided"}, status=400)
    uploaded = []
    failed = []
    for f in files:
        try:
            img = Image.objects.create(album=shared_link.album, file=f)
            uploaded.append(
                {
                    "uid": str(img.uid),
                    "file": img.file.url,
                    "uploaded_at": img.uploaded_at.isoformat(),
                }
            )
        except Exception as e:
            failed.append({"filename": f.name, "error": str(e)})
    return JsonResponse(
        {
            "success_count": len(uploaded),
            "fail_count": len(failed),
            "uploaded": uploaded,
            "failed": failed,
        },
        status=207 if failed else 201,
    )


@allow_temp_user
def get_shared_image(request, uid, image_uid):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        shared_link = SharedLink.objects.get(uid=uid)
    except SharedLink.DoesNotExist:
        return JsonResponse({"error": "Shared link not found"}, status=404)
    try:
        image = Image.objects.get(uid=image_uid, album=shared_link.album)
    except Image.DoesNotExist:
        return JsonResponse({"error": "Image not found"}, status=404)
    return FileResponse(image.file.open("rb"), as_attachment=False)
