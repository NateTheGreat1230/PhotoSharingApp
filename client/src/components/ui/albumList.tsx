import { useEffect, useState } from 'react';
import { fetchAlbums } from '../../api/gallery';
import { Link } from 'react-router-dom';

export default function AlbumList() {
  const [albums, setAlbums] = useState<{ uid: string; title: string }[]>([]);
  useEffect(() => {
    fetchAlbums().then((data) => setAlbums(data.albums));
  }, []);

  return (
    <div className='p-4'>
      <h2>Your Albums</h2>
      <ul>
        {albums.map((a) => (
          <li key={a.uid}>
            <Link to={`/gallery?album=${a.uid}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
