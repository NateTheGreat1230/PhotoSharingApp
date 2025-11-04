const API_BASE = '/gallery';
import * as cookie from 'cookie';

export type AlbumList = {
  albums: {
    owner: string;
    uid: string;
    title: string;
    created_at: string;
  }[];
};

export type Image = {
  uid: string;
  album: string;
  file: string;
  uploaded_at: string;
};

export type Album = {
  album: {
    owner: string;
    uid: string;
    title: string;
    created_at: string;
  };
  images: Image[];
};

export async function fetchAlbums() {
  const response = await fetch(`${API_BASE}/albums/`, {
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Failed to fetch albums');
  return response.json();
}

export async function createAlbum(title: string) {
  const csrfToken = cookie.parse(document.cookie).csrftoken;
  if (!csrfToken) throw new Error('CSRF token not found');

  const response = await fetch(`${API_BASE}/albums/`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) throw new Error('Failed to create album');
  return response.json();
}

export async function fetchAlbum(uid: string) {
  const response = await fetch(`${API_BASE}/albums/${uid}/`, {
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Failed to fetch album');
  return response.json();
}

export async function uploadImage(uid: string, file: File) {
  const csrfToken = cookie.parse(document.cookie).csrftoken;
  if (!csrfToken) throw new Error('CSRF token not found');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/albums/${uid}/images/`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-CSRFToken': csrfToken,
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload image');
  return response.json();
}
