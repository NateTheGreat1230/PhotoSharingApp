import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/mainLayout';
import Home from './pages/home';
import Gallery from './pages/gallery';
import NotFoundPage from './pages/notfound';
import Profile from './pages/profile';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
