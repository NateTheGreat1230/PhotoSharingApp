import type { ReactNode } from 'react';
import Footer from '../components/ui/footer';
import HeaderBar from '../components/ui/headerbar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col bg-background text-text font-sans'>
      <HeaderBar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
