const API_BASE = '/gallery/shared';
import * as cookie from 'cookie';

export type SharedAlbum = {
  album: {
    owner: string;
    uid: string;
    title: string;
    created_at: string;
  };
  images: SharedImage[];
};

export type SharedImage = {
  uid: string;
  album: string;
  file: string;
  uploaded_at: string;
};

export async function getSharedAlbum(uid: string) {
  const response = await fetch(`${API_BASE}/${uid}`, {
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Failed to fetch shared album');
  const albumData: SharedAlbum = await response.json();
  albumData.images = albumData.images.map((img) => ({
    ...img,
    file: `http://127.0.0.1:8000${img.file}`,
  }));
  return albumData;
}

export async function uploadSharedImages(uid: string, files: File[]) {
  const csrfToken = cookie.parse(document.cookie).csrftoken;
  if (!csrfToken) throw new Error('CSRF token not found');

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const response = await fetch(`${API_BASE}/${uid}images/`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-CSRFToken': csrfToken,
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload images to shared album');
  return response.json();
}

export async function deleteSharedImage(sharedUid: string, imageUid: string) {
  const csrfToken = cookie.parse(document.cookie).csrftoken;
  if (!csrfToken) throw new Error('CSRF token not found');

  const response = await fetch(
    `${API_BASE}/${sharedUid}images/${imageUid}/delete/`,
    {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to delete image from shared album');
  return response.json();
}
