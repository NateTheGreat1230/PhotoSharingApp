import { useEffect, useRef, useState } from 'react';
import ModalForm from './modalForm';

export default function MultiImageUploadModal({
  open,
  setOpen,
  onUpload,
  albumTitle,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpload: (files: File[]) => Promise<void>;
  albumTitle?: string;
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadedCount(0);
      setTotalToUpload(selectedFiles.length);

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await onUpload([file]);
        setUploadedCount(i + 1);
      }

      setSelectedFiles([]);
      setError(null);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to upload images.');
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedFiles]);

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title='Upload Images'
      description={
        selectedFiles.length > 0
          ? `Uploading ${selectedFiles.length} image${
              selectedFiles.length > 1 ? 's' : ''
            } to "${albumTitle}"`
          : 'Select images to upload.'
      }
      submitText={isUploading ? 'Uploading...' : 'Upload'}
      submitDisabled={isUploading || selectedFiles.length === 0}
      onSubmit={handleSubmit}
      formFields={
        <div className='flex flex-col gap-4'>
          {/* File input */}
          <label className='cursor-pointer w-full text-center border-2 border-dashed border-accent rounded-lg py-4 bg-background hover:bg-accent/10 transition-colors'>
            <span className='text-text/70'>Tap or click to select images</span>
            <input
              type='file'
              accept='image/*'
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
              className='hidden'
              ref={fileInputRef}
            />
          </label>

          {/* Preview grid */}
          {selectedFiles.length > 0 && (
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 overflow-hidden overflow-y-scroll h-52'>
              {selectedFiles.map((file, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className='object-cover w-full h-24 rounded-md border border-accent/30'
                  />
                  <button
                    type='button'
                    onClick={() => removeFile(index)}
                    className='absolute top-1 right-1 bg-accent text-white text-xs leading-none rounded-full w-5 h-5 flex items-center justify-center'
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {isUploading && (
            <div className='flex flex-col gap-2'>
              <p className='text-sm text-text/80'>
                Uploading {uploadedCount} / {totalToUpload}...
              </p>
              <div className='w-full bg-accent/20 h-2 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-accent transition-all duration-300'
                  style={{ width: `${(uploadedCount / totalToUpload) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && <p className='text-red-500 text-sm'>{error}</p>}
        </div>
      }
    />
  );
}
