import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/mainLayout';
import Home from './pages/home';
import Gallery from './pages/gallery';
import NotFoundPage from './pages/notfound';
import Profile from './pages/profile';
import Shared from './pages/shared';
import { useEffect, useState } from 'react';
import { getUserType } from './api/auth';
import SharedLayout from './layouts/sharedLayout';

export default function App() {
  const [userType, setUserType] = useState<string | null>(null);
  useEffect(() => {
    document.title = 'Photo Sharing App';
    getUserType().then((data) => setUserType(data));
  }, []);
  return (
    <BrowserRouter>
      {userType && userType === 'temporary' ? (
        <SharedLayout>
          <Routes>
            <Route path='/shared' element={<Shared />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </SharedLayout>
      ) : (
        <MainLayout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      )}
    </BrowserRouter>
  );
}
