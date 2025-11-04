import { useEffect, useState, useRef } from 'react';
import type { Image } from '../../api/gallery';

export default function GalleryLayout({ images }: { images: Image[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<
    { src: string; width: number; height: number; uid: string }[][]
  >([]);

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

  return (
    <div ref={containerRef} className='flex flex-col gap-2'>
      {rows.map((row, i) => (
        <div key={i} className='flex gap-2'>
          {row.map((img) => (
            <img
              key={img.uid}
              src={img.src}
              style={{ width: img.width, height: img.height }}
              className='rounded-md object-cover transition-transform duration-200 hover:scale-[1.02]'
            />
          ))}
        </div>
      ))}
    </div>
  );
}
