import type { ReactNode } from 'react';
import Footer from '../components/ui/footer';
import SharedHeaderBar from '../components/ui/sharedHeader';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col bg-background text-text font-sans'>
      <SharedHeaderBar />
      <main className='flex-1 p-4'>{children}</main>
      <Footer />
    </div>
  );
}
