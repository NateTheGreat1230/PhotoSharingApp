const API_BASE = '/registration';

export type UserType = 'registered' | 'temporary' | 'anonymous';

export type User = {
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
};

export async function logout() {
  const response = await fetch(`${API_BASE}/logout/`, {
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Failed to log out');
  window.location.href = '/registration/sign_in/';
}

export async function getUserType() {
  const response = await fetch(`${API_BASE}/auth/user_type/`, {
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Failed to fetch user type');
  const data = await response.json();
  return data.user_type;
}

export async function getUser() {
  const response = await fetch(`${API_BASE}/auth/get_user/`, {
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Failed to fetch user info');
  const userData: User = await response.json();
  userData.full_name = `${userData.first_name} ${userData.last_name}`;
  return userData;
}
