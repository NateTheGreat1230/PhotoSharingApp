import { useEffect, useState } from 'react';
import {
  getProfileData,
  getUser,
  type ProfileData,
  type User,
} from '../api/auth';
import Loading from '../components/ui/loading';
import ErrorComponent from '../components/ui/error';
import PersonIcon from '../components/icons/personIcon';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getUser()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error('Failed to fetch user data:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getProfileData()
      .then((data) => setProfileData(data))
      .catch((err) => {
        console.error('Failed to fetch profile data:', err);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!user && !loading) {
    return (
      <ErrorComponent message='Unable to load profile information. Please try again later.' />
    );
  }

  const { full_name, email } = user!;
  const { number_of_albums, number_of_images } = profileData || {
    number_of_albums: 0,
    number_of_images: 0,
  };

  return (
    <div className='min-h-screen bg-background text-text p-6'>
      <div className='flex flex-col items-center gap-3 mb-6'>
        <div className='w-24 h-24 rounded-full border-4 border-accent shadow-md'>
          <PersonIcon classes='w-16 h-16 mx-auto mt-2 text-accent' />
        </div>
        <h2 className='text-xl font-semibold'>{full_name}</h2>
        <p className='text-sm text-gray-400'>{email}</p>
      </div>
      <div className='grid grid-cols-2 gap-3 text-center mb-8'>
        <div className='p-3 rounded-lg bg-secondary/20'>
          <p className='text-lg font-semibold'>{number_of_albums}</p>
          <p className='text-xs text-gray-400'>Albums</p>
        </div>
        <div className='p-3 rounded-lg bg-secondary/20'>
          <p className='text-lg font-semibold'>{number_of_images}</p>
          <p className='text-xs text-gray-400'>Photos</p>
        </div>
      </div>
      <button
        className='btn-outline'
        onClick={() => {
          fetch('/registration/logout/', { credentials: 'same-origin' }).then(
            () => {
              window.location.href = '/registration/sign_in/';
            }
          );
        }}
      >
        Logout
      </button>
    </div>
  );
}
