import Footer from '../components/ui/footer';
import HeaderBar from '../components/ui/headerbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col'>
      <HeaderBar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
