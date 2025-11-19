import { useEffect, useState } from 'react';
import { TextInput } from '../components/ui/inputs';
import Loading from '../components/ui/loading';
import ErrorComponent from '../components/ui/error';
import ModalForm from '../components/ui/modalForm';
import PlusIcon from '../components/icons/plusIcon';
import { fetchAlbums, createAlbum, type AlbumList } from '../api/gallery';
import { Link } from 'react-router-dom';

export default function Home() {
  const [albums, setAlbums] = useState<AlbumList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchAlbums()
      .then((data) => {
        setAlbums(data);
      })
      .catch(() => setError('Failed to load albums.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    if (!newTitle.trim()) return;

    try {
      const created = await createAlbum(newTitle.trim());

      setAlbums((prev) => {
        if (!prev) return null;

        const updated = {
          albums: [...prev.albums, created],
          length: prev.length + 1,
        };

        return updated;
      });

      setNewTitle('');
      setOpenCreateModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create album.');
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorComponent message={error} />;

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-1'>Welcome back!</h1>
      <p className='text-text/70 mb-4'>
        Organize and share your photos with ease.
      </p>
      <button
        className='flex items-center gap-2 btn-primary mb-4'
        onClick={() => setOpenCreateModal(true)}
      >
        <PlusIcon classes='w-5 h-5' />
        Create New Album
      </button>
      <h2 className='text-xl font-semibold mb-3'>Your Albums</h2>
      {albums?.length === 0 ? (
        <p className='text-text/60'>You haven't created any albums yet.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2'>
          {albums?.albums.map((a) => (
            <Link
              key={a.uid}
              to={`/gallery?album=${a.uid}`}
              className='rounded-lg border border-border bg-secondary/10 p-4 hover:bg-secondary/20 transition-colors'
            >
              <h3 className='font-medium'>{a.title}</h3>
              <p className='text-xs text-text/60 mt-1'>
                Created {new Date(a.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
      <ModalForm
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        title='Create New Album'
        description='Give your album a name to get started.'
        formFields={
          <TextInput
            label='Album Name'
            placeholder='My Cool Album'
            changeHandler={(e) => setNewTitle(e.target.value)}
            required
          />
        }
        submitText='Create Album'
        onSubmit={handleCreate}
      />
    </div>
  );
}
