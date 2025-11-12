import { useEffect, useState, type ReactNode } from 'react';
import Footer from '../components/ui/footer';
import HeaderBar from '../components/ui/headerbar';
import { getUser, type User } from '../api/auth';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getUser().then((data) => setUser(data));
  }, []);
  return (
    <div className='min-h-screen flex flex-col bg-background text-text font-sans'>
      <HeaderBar user={user} />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
