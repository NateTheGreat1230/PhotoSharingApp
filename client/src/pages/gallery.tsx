import { useState, useEffect } from 'react';
import {
  fetchAlbum,
  type Album,
  uploadImages,
  shareAlbum,
  unShareAlbum,
  deleteImage,
  deleteAlbum,
} from '../api/gallery';
import GalleryLayout from '../components/ui/galleryLayout';
import ModalForm from '../components/ui/modalForm';
import MultiImageUploadModal from '../components/ui/imageUploadModal';
import AlbumInfoCard from '../components/ui/albumInfo';
import PlusIcon from '../components/icons/plusIcon';
import Loading from '../components/ui/loading';
import ErrorComponent from '../components/ui/error';
import ShareIcon from '../components/icons/shareIcon';
import TrashIcon from '../components/icons/trashIcon';

export default function Gallery() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('album') || '';

  useEffect(() => {
    fetchAlbum(uid)
      .then((data) => {
        setAlbum(data);
      })
      .finally(() => setLoading(false));
  }, [uid]);

  async function handleShare() {
    if (passphrase.trim() === '' || !album) return;
    try {
      const data = await shareAlbum(uid, passphrase);
      setAlbum({
        ...album,
        is_shared: true,
        shared_link: {
          uid: data.uid,
          link: data.link,
          created_at: data.created_at,
          passphrase: passphrase,
        },
      });
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setShareModalOpen(false);
    }
  }

  async function handleUnshare() {
    if (!album) return;
    try {
      await unShareAlbum(uid);
      setAlbum({ ...album, is_shared: false, shared_link: null });
    } catch (err) {
      console.error('Unshare failed:', err);
    }
  }

  async function handleDeleteAlbum(uid: string) {
    if (!album) return;
    try {
      await deleteAlbum(uid);
      window.location.href = '/';
    } catch (err) {
      console.error('Delete album failed:', err);
    }
  }

  async function handleUpload(files: File[]) {
    try {
      const data = await uploadImages(uid, files);
      if (data.uploaded?.length) {
        setAlbum((prev) =>
          prev
            ? {
                ...prev,
                images: [...prev.images, ...data.uploaded],
              }
            : prev
        );
      }
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error('Upload failed', err);
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (!album && !loading) {
    return (
      <ErrorComponent message='Unable to load album. It may not exist or you may not have access.' />
    );
  }

  return (
    <>
      {album && (
        <AlbumInfoCard
          owner={album.album.owner}
          title={album.album.title}
          created_at={album.album.created_at}
          shared={album.is_shared}
          shared_link={album.shared_link}
          actions={
            <div className='flex flex-col gap-2'>
              <button
                className='p-2 rounded-md bg-accent text-white hover:bg-accent/80 animate-colors'
                title='Add'
                onClick={() => setIsUploadModalOpen(true)}
              >
                <PlusIcon classes='w-6 h-6' />
              </button>
              {album.is_shared ? (
                <button
                  className='p-2 rounded-md bg-red-500 text-white hover:bg-red-600 animate-colors'
                  title='Unshare Album'
                  onClick={handleUnshare}
                >
                  <ShareIcon classes='w-6 h-6 rotate-180' />
                </button>
              ) : (
                <button
                  className='p-2 rounded-md bg-accent text-white hover:bg-accent/80 animate-colors'
                  title='Share Album'
                  onClick={() => setShareModalOpen(true)}
                >
                  <ShareIcon classes='w-6 h-6' />
                </button>
              )}
              <button
                onClick={() => setConfirmDeleteModalOpen(true)}
                title='Delete Album'
                className='p-2 rounded-md bg-red-500 text-white hover:bg-red-600 animate-colors justify-center flex'
              >
                <TrashIcon classes='h-5' />
              </button>
            </div>
          }
        />
      )}
      {album?.images && album.images.length > 0 ? (
        <GalleryLayout
          images={album?.images || []}
          deleteFn={deleteImage}
          albumUid={uid}
        />
      ) : (
        <p className='text-text/70'>No images in this album yet.</p>
      )}
      <ModalForm
        open={shareModalOpen}
        setOpen={setShareModalOpen}
        title='Share Album'
        description='Enter the passphrase to share this album.'
        formFields={
          <input
            type='text'
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className='w-full border border-gray-300 rounded-md p-2'
            placeholder='Passphrase'
          />
        }
        submitText='Generate Link'
        onSubmit={handleShare}
      />
      <MultiImageUploadModal
        open={isUploadModalOpen}
        setOpen={setIsUploadModalOpen}
        onUpload={handleUpload}
        albumTitle={album?.album.title}
      />
      <ModalForm
        open={confirmDeleteModalOpen}
        setOpen={setConfirmDeleteModalOpen}
        title='Confirm Delete Album'
        formFields={
          'Are you sure you want to delete this album? This action cannot be undone.'
        }
        submitText='Delete Album'
        onSubmit={() => handleDeleteAlbum(uid)}
        description={''}
      />
    </>
  );
}
