import { useEffect, useState, useRef } from 'react';

export default function JustifiedGallery({
  images,
}: {
  images: { src: string; alt?: string }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<
    { src: string; alt?: string; r: number }[]
  >([]);
  const [rows, setRows] = useState<
    { src: string; width: number; height: number; alt?: string }[][]
  >([]);

  const baseHeight = 150;
  const gap = 8;

  useEffect(() => {
    loadedImages.length = 0;
    setLoadedImages([]);
    setRows([]);

    images.forEach((img) => {
      const image = new Image();
      image.src = img.src;
      image.onload = () => {
        const loaded = {
          src: img.src,
          alt: img.alt,
          r: image.naturalWidth / image.naturalHeight,
        };
        setLoadedImages((prev) => [...prev, loaded]);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;

    const newRows: typeof rows = [];
    let currentRow: typeof loadedImages = [];
    let sumRatios = 0;

    loadedImages.forEach((img) => {
      currentRow.push(img);
      sumRatios += img.r;

      const rowWidth = sumRatios * baseHeight + gap * (currentRow.length - 1);
      if (rowWidth >= containerWidth) {
        const rowHeight =
          (containerWidth - gap * (currentRow.length - 1)) / sumRatios;
        newRows.push(
          currentRow.map((i) => ({
            ...i,
            width: i.r * rowHeight,
            height: rowHeight,
          }))
        );
        currentRow = [];
        sumRatios = 0;
      }
    });

    if (currentRow.length > 0) {
      newRows.push(
        currentRow.map((i) => ({
          ...i,
          width: i.r * baseHeight,
          height: baseHeight,
        }))
      );
    }

    setRows(newRows);
  }, [loadedImages]);

  return (
    <div ref={containerRef} className='flex flex-col gap-2'>
      {rows.map((row, i) => (
        <div key={i} className='flex gap-2'>
          {row.map((img, j) => (
            <img
              key={j}
              src={img.src}
              alt={img.alt}
              style={{ width: img.width, height: img.height }}
              className='rounded-md object-cover'
            />
          ))}
        </div>
      ))}
    </div>
  );
}
