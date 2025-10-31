import { useState } from 'react';
import Modal from '../components/ui/modal';
import { TextInput } from '../components/ui/inputs';

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-2'>
        Welcome to the Photo Sharing App
      </h1>
      <p className='mb-4'>Share your photos with the world!</p>

      <button className='btn-primary' onClick={() => setOpen(true)}>
        Get Started
      </button>
      <button className='btn-outline mt-3'>outline btn</button>
      <button className='btn-secondary mt-3'>btn secondary</button>

      <Modal
        open={open}
        setOpen={setOpen}
        title='Get Started'
        confirmText='Create'
      >
        <p className='mb-4'>
          Ready to share your first photo? Let’s create an album to get started.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Album created!');
            setOpen(false);
          }}
          className='flex flex-col gap-3'
        >
          <TextInput
            label='Album Name'
            placeholder='My Vacation Photos'
            required
          />
        </form>
      </Modal>
    </div>
  );
}
