export default function HeaderBar() {
  async function logout() {
    const res = await fetch('/registration/logout/', {
      credentials: 'same-origin', // include cookies!
    });

    if (res.ok) {
      // navigate away from the single page app!
      window.location.href = '/registration/sign_in/';
    } else {
      // handle logout failed!
    }
  }

  return (
    <header className='header-bar'>
      <button className='text-blue-900' onClick={logout}>
        Logout
      </button>
    </header>
  );
}
