import { useState, useEffect } from 'react';
import {
  fetchAlbum,
  type Album,
  uploadImage,
  shareAlbum,
  unShareAlbum,
} from '../api/gallery';
import GalleryLayout from '../components/ui/galleryLayout';
import ModalForm from '../components/ui/modalForm';

export default function Gallery() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('album') || '';

  useEffect(() => {
    fetchAlbum(uid).then((data) => {
      setAlbum(data);
    });
  }, [uid]);

  async function handleUpload() {
    if (!selectedFile || !album) return;
    try {
      setIsUploading(true);
      const uploaded = await uploadImage(uid, selectedFile);
      console.log('Upload success:', uploaded);
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleShare() {
    if (passphrase.trim() === '' || !album) return;
    try {
      shareAlbum(uid, passphrase).then((data) => {
        const shareLink = `${window.location.origin}/registration/enter_passphrase`;
        alert(
          `Shareable Link: ${shareLink} with passphrase: ${data.passphrase} and album id: ${data.uid}`
        );
      });
    } catch (err) {
      console.error('Share failed:', err);
      alert('Failed to share album.');
    } finally {
      setShareModalOpen(false);
    }
  }

  async function handleUnshare() {
    if (!album) return;
    try {
      await unShareAlbum(uid);
      alert('Album unshared successfully.');
    } catch (err) {
      console.error('Unshare failed:', err);
      alert('Failed to unshare album.');
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  }

  return (
    <div className='p-4 bg-background min-h-screen'>
      <h1 className='text-text text-2xl mb-4'>Gallery</h1>
      {album && <h2 className='text-text text-xl mb-6'>{album.album.title}</h2>}
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
      {album?.is_shared ? (
        <button className='btn-secondary mb-4' onClick={handleUnshare}>
          Unshare Album
        </button>
      ) : (
        <button
          onClick={() => setShareModalOpen(true)}
          className='btn-secondary mb-4'
        >
          Share Album
        </button>
      )}
      {album?.images && album.images.length > 0 ? (
        <GalleryLayout images={album?.images || []} />
      ) : (
        <p className='text-text/70'>No images in this album yet.</p>
      )}
      {/* Share Modal */}
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
    </div>
  );
}
