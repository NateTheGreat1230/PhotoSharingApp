const API_BASE = '/registration';

export async function getUserType() {
  const response = await fetch(`${API_BASE}/auth/user_type/`, {
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Failed to fetch user type');
  const data = await response.json();
  return data.user_type;
}

export async function getUser() {
  const response = await fetch(`${API_BASE}/auth/user/`, {
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Failed to fetch user info');
  return response.json();
}
