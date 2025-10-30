import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

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
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <button className='text-blue-900' onClick={logout}>
        Logout
      </button>
    </>
  );
}

export default App;
