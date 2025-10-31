import GalleryLayout from '../components/ui/galleryLayout';

export default function Gallery() {
  const images = [
    { src: 'https://picsum.photos/300/400', alt: 'Photo 1' }, // portrait
    { src: 'https://picsum.photos/400/300', alt: 'Photo 2' }, // landscape
    { src: 'https://picsum.photos/350/350', alt: 'Photo 3' }, // square
    { src: 'https://picsum.photos/450/300', alt: 'Photo 4' },
    { src: 'https://picsum.photos/300/450', alt: 'Photo 5' },
    { src: 'https://picsum.photos/400/400', alt: 'Photo 6' },
    { src: 'https://picsum.photos/320/480', alt: 'Photo 7' },
    { src: 'https://picsum.photos/480/320', alt: 'Photo 8' },
    { src: 'https://picsum.photos/360/360', alt: 'Photo 9' },
    { src: 'https://picsum.photos/500/300', alt: 'Photo 10' },
    { src: 'https://picsum.photos/300/500', alt: 'Photo 11' },
    { src: 'https://picsum.photos/420/350', alt: 'Photo 12' },
    { src: 'https://picsum.photos/350/420', alt: 'Photo 13' },
    { src: 'https://picsum.photos/400/300', alt: 'Photo 14' },
    { src: 'https://picsum.photos/300/400', alt: 'Photo 15' },
    { src: 'https://picsum.photos/360/360', alt: 'Photo 16' },
    { src: 'https://picsum.photos/480/320', alt: 'Photo 17' },
    { src: 'https://picsum.photos/320/480', alt: 'Photo 18' },
    { src: 'https://picsum.photos/500/500', alt: 'Photo 19' },
    { src: 'https://picsum.photos/400/400', alt: 'Photo 20' },
    { src: 'https://picsum.photos/350/450', alt: 'Photo 21' },
    { src: 'https://picsum.photos/450/350', alt: 'Photo 22' },
    { src: 'https://picsum.photos/360/360', alt: 'Photo 23' },
    { src: 'https://picsum.photos/420/300', alt: 'Photo 24' },
    { src: 'https://picsum.photos/300/420', alt: 'Photo 25' },
  ];

  return (
    <div className='p-4 bg-background min-h-screen'>
      <h1 className='text-text text-2xl mb-4'>Gallery</h1>
      <GalleryLayout images={images} />
    </div>
  );
}
