import { useState } from 'react';
import Modal from '../components/ui/modal';
import { TextInput } from '../components/ui/inputs';

export default function Profile() {
  const [open, setOpen] = useState(false);

  return (
    <div className='min-h-screen bg-background text-text p-6'>
      <div className='flex flex-col items-center gap-3 mb-6'>
        <img
          src='https://via.placeholder.com/100'
          alt='Profile'
          className='w-24 h-24 rounded-full border-4 border-accent shadow-md'
        />
        <h2 className='text-xl font-semibold'>Nate Washburn</h2>
        <p className='text-sm text-gray-400'>nate@example.com</p>
      </div>
      <div className='grid grid-cols-3 gap-3 text-center mb-8'>
        <div className='p-3 rounded-lg bg-secondary/20'>
          <p className='text-lg font-semibold'>24</p>
          <p className='text-xs text-gray-400'>Albums</p>
        </div>
        <div className='p-3 rounded-lg bg-secondary/20'>
          <p className='text-lg font-semibold'>187</p>
          <p className='text-xs text-gray-400'>Photos</p>
        </div>
        <div className='p-3 rounded-lg bg-secondary/20'>
          <p className='text-lg font-semibold'>4.8</p>
          <p className='text-xs text-gray-400'>Rating</p>
        </div>
      </div>
      <div className='flex flex-col gap-3 items-center'>
        <button
          className='btn-primary w-full sm:w-1/2'
          onClick={() => setOpen(true)}
        >
          Edit Profile
        </button>

        <button
          className='btn-outline w-full sm:w-1/2'
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

      <Modal open={open} setOpen={setOpen} title='Edit Profile'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Profile updated!');
            setOpen(false);
          }}
          className='flex flex-col gap-4'
        >
          <TextInput label='Name' placeholder='Nate Washburn' required />
          <TextInput label='Email' placeholder='nate@example.com' required />
        </form>
      </Modal>
    </div>
  );
}
