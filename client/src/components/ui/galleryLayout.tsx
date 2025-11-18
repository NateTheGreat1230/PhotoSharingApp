import { useEffect, useState, useRef } from 'react';
import type { Image } from '../../api/gallery';
import Modal from './modal';

export default function GalleryLayout({
  images,
  deleteFn,
}: {
  images: Image[];
  deleteFn: (albumUid: string, imageUid: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<
    { src: string; width: number; height: number; uid: string }[][]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<Image | null>(null);

  const baseHeight = 180;
  const gap = 8;

  // Load each image to get its aspect ratio
  useEffect(() => {
    if (!images?.length) {
      setRows([]);
      return;
    }

    const loadImages = async () => {
      const loaded: { uid: string; src: string; r: number }[] =
        await Promise.all(
          images.map(
            (img) =>
              new Promise<{ uid: string; src: string; r: number }>(
                (resolve) => {
                  const image = new window.Image();
                  image.src = img.file;
                  image.onload = () =>
                    resolve({
                      uid: img.uid,
                      src: img.file,
                      r: image.naturalWidth / image.naturalHeight,
                    });
                  image.onerror = () =>
                    resolve({
                      uid: img.uid,
                      src: img.file,
                      r: 1,
                    });
                }
              )
          )
        );

      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const newRows: typeof rows = [];
      let currentRow: typeof loaded = [];
      let sumRatios = 0;

      for (const img of loaded) {
        currentRow.push(img);
        sumRatios += img.r;

        const rowWidth = sumRatios * baseHeight + gap * (currentRow.length - 1);
        if (rowWidth >= containerWidth) {
          const rowHeight =
            (containerWidth - gap * (currentRow.length - 1)) / sumRatios;
          newRows.push(
            currentRow.map((i) => ({
              uid: i.uid,
              src: i.src,
              width: i.r * rowHeight,
              height: rowHeight,
            }))
          );
          currentRow = [];
          sumRatios = 0;
        }
      }

      if (currentRow.length > 0) {
        newRows.push(
          currentRow.map((i) => ({
            uid: i.uid,
            src: i.src,
            width: i.r * baseHeight,
            height: baseHeight,
          }))
        );
      }

      setRows(newRows);
    };

    loadImages();
  }, [images]);

  function handleDeleteImage(albumUid: string, imageUid: string) {
    deleteFn(albumUid, imageUid);
    if (modalImage?.uid === imageUid) {
      setModalOpen(false);
      setModalImage(null);
    }
  }

  async function downloadOrOpenImage(url: string, filename: string) {
    try {
      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: blob.type });
        await navigator.share({
          files: [file],
          title: filename,
        });
      } else {
        // Fallback: traditional download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Download/share failed', err);
      // Fallback to open in new tab for iOS Safari
      window.open(url, '_blank');
    }
  }
  // function downloadOrOpenImage(url: string, filename: string) {
  //   if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  //     window.open(url, '_blank');
  //   } else {
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   }
  // }

  return (
    <div ref={containerRef} className='flex flex-col gap-2'>
      {rows.map((row, i) => (
        <div key={i} className='flex gap-2'>
          {row.map((img) => (
            <button
              key={img.uid}
              onClick={() => {
                setModalOpen(true);
                setModalImage(
                  images.find((image) => image.uid === img.uid) || null
                );
              }}
            >
              <img
                src={img.src}
                style={{ width: img.width, height: img.height }}
                className='rounded-md object-cover transition-transform duration-200 hover:scale-[1.02]'
              />
            </button>
          ))}
        </div>
      ))}
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        title='Image Preview'
        showClose={false}
        children={
          <>
            <div className='flex justify-center items-center'>
              <img
                src={modalImage?.file || ''}
                alt='Preview'
                className='max-w-full max-h-full'
              />
            </div>
            <div className='mt-4 flex justify-between'>
              <div className='flex'>
                <button
                  onClick={() => {
                    if (modalImage) {
                      handleDeleteImage(modalImage.album, modalImage.uid);
                    }
                  }}
                  className='btn-secondary'
                >
                  Delete
                </button>
                <button
                  className='btn-primary ml-2'
                  onClick={() => {
                    if (modalImage) {
                      downloadOrOpenImage(
                        modalImage.file,
                        modalImage.file.split('/').pop() || 'image.jpg'
                      );
                    }
                  }}
                >
                  Download
                </button>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className='btn-outline'
              >
                Close
              </button>
            </div>
          </>
        }
      />
    </div>
  );
}
