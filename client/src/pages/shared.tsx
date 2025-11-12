import { useState, useEffect } from 'react';
import GalleryLayout from '../components/ui/galleryLayout';
import {
  getSharedAlbum,
  uploadSharedImage,
  type SharedAlbum,
} from '../api/shared';
import Loading from '../components/ui/loading';
import ErrorComponent from '../components/ui/error';
import AlbumInfoCard from '../components/ui/albumInfo';

export default function Shared() {
  const [album, setAlbum] = useState<SharedAlbum | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('album') || '';

  useEffect(() => {
    getSharedAlbum(uid)
      .then((data) => {
        setAlbum(data);
      })
      .finally(() => setLoading(false));
  }, [uid]);

  async function handleUpload() {
    if (!selectedFile || !album) return;
    try {
      setIsUploading(true);
      const uploaded = await uploadSharedImage(uid, selectedFile);
      console.log('Upload success:', uploaded);
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
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
        />
      )}
      <div className='mb-6 flex flex-col gap-3 max-w-md'>
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          disabled={isUploading}
          className='file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent file:text-text hover:file:bg-accent/80 text-text'
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className='px-4 py-2 rounded-md bg-primary text-white disabled:bg-gray-500'
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
      {album?.images && album.images.length > 0 ? (
        <GalleryLayout images={album?.images || []} />
      ) : (
        <p className='text-text/70'>No images in this album yet.</p>
      )}
    </>
  );
}
