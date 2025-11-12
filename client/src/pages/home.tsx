import { useState } from 'react';
import { TextInput } from '../components/ui/inputs';
import AlbumList from '../components/ui/albumList';
import { createAlbum } from '../api/gallery';
import ModalForm from '../components/ui/modalForm';
import PlusIcon from '../components/icons/plusIcon';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const handleCreate = async () => {
    if (!newTitle) return;
    await createAlbum(newTitle);
    setNewTitle('');
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-2'>
        Welcome to the Photo Sharing App
      </h1>
      <p className='mb-4'>Share your photos with the world!</p>

      <button className='btn-primary' onClick={() => setOpen(true)}>
        Get Started
      </button>
      <button
        className='p-2 rounded-md bg-accent text-white hover:bg-accent/80 animate-colors'
        title='Add'
      >
        <PlusIcon classes='w-6 h-6' />
      </button>
      <button className='btn-outline mt-3'>outline btn</button>
      <button className='btn-secondary mt-3'>btn secondary</button>
      <AlbumList />

      <ModalForm
        open={open}
        setOpen={setOpen}
        title='Get Started'
        description='Ready to share your first photo? Let’s create an album to get started.'
        formFields={
          <TextInput
            label='Album Name'
            placeholder='My Vacation Photos'
            changeHandler={(e) => setNewTitle(e.target.value)}
            required
          />
        }
        submitText='Create'
        onSubmit={handleCreate}
      />
    </div>
  );
}
