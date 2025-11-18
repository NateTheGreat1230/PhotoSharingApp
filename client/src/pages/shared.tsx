import { useState, useEffect } from 'react';
import GalleryLayout from '../components/ui/galleryLayout';
import {
  getSharedAlbum,
  uploadSharedImages,
  type SharedAlbum,
} from '../api/shared';
import Loading from '../components/ui/loading';
import ErrorComponent from '../components/ui/error';
import AlbumInfoCard from '../components/ui/albumInfo';
import PlusIcon from '../components/icons/plusIcon';
import MultiImageUploadModal from '../components/ui/imageUploadModal';

export default function Shared() {
  const [album, setAlbum] = useState<SharedAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('album') || '';

  useEffect(() => {
    getSharedAlbum(uid)
      .then((data) => {
        setAlbum(data);
      })
      .finally(() => setLoading(false));
  }, [uid]);

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
          showSharedStatus={false}
          actions={
            <button
              className='p-2 rounded-md bg-accent text-white hover:bg-accent/80 animate-colors'
              title='Add'
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon classes='w-6 h-6' />
            </button>
          }
        />
      )}
      {album?.images && album.images.length > 0 ? (
        <GalleryLayout images={album?.images || []} deleteFn={() => {}} />
      ) : (
        <p className='text-text/70'>No images in this album yet.</p>
      )}
      <MultiImageUploadModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onUpload={(files) => uploadSharedImages(uid, files)}
        albumTitle={album?.album.title}
      />
    </>
  );
}
