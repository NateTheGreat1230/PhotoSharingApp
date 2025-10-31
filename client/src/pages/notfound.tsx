import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen text-center'>
      <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
      <p className='text-gray-600 mb-6'>
        The page you’re looking for doesn’t exist.
      </p>
      <Link to='/' className='text-blue-500 hover:text-blue-700 transition'>
        Go back home
      </Link>
    </div>
  );
}
