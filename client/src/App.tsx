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
import PersonIcon from './components/icons/personIcon';
import Footer from './components/ui/footer';
import Loading from './components/ui/loading';

export default function App() {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Photo Sharing App';
    getUserType()
      .then((data) => setUserType(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col bg-background text-text font-sans'>
        <header className='flex items-center justify-between px-4 py-2 bg-primary text-text shadow-md rounded-b-lg'>
          <h1 className='text-lg font-semibold'>PhotoApp</h1>
          <div className='p-2 rounded-full hover:bg-accent/20 animate-colors'>
            <span className='flex items-center'>
              <PersonIcon classes='w-6 h-6' />
            </span>
          </div>
        </header>
        <Loading />
        <Footer />
      </div>
    );
  }

  return (
    <BrowserRouter>
      {userType === 'temporary' ? (
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
