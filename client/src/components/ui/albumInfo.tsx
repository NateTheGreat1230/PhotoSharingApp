import { useState, type ReactNode } from 'react';
import type { SharedLink } from '../../api/gallery';

export default function AlbumInfoCard({
  owner,
  title,
  created_at,
  shared,
  shared_link,
  actions,
}: {
  owner: string;
  title: string;
  created_at: string;
  shared?: boolean;
  shared_link?: SharedLink | null;
  actions?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopyShareInfo() {
    if (!shared_link) return;

    const shareText = `Share this album:\n\nLink: ${shared_link.link}\nPassphrase: ${shared_link.uid}`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className='bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-8 max-w-2xl mx-auto flex flex-col relative'>
      <h2 className='text-2xl font-semibold text-white mb-3'>{title}</h2>
      <div className='flex flex-col gap-3 text-sm text-gray-300'>
        <div className='flex items-center gap-2'>
          <span className='truncate'>Owner: {owner}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span>
            Created:{' '}
            {new Date(created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        {shared ? (
          <div
            className='flex items-center gap-2 cursor-pointer group'
            onClick={handleCopyShareInfo}
          >
            <span className='text-accent font-medium underline group-hover:text-accent/80 transition-colors'>
              Shared Album (click to copy)
            </span>
            {copied && (
              <span className='text-xs bg-black/70 text-white px-2 py-1 rounded-md'>
                Copied!
              </span>
            )}
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <span className='text-red-400 font-medium'>Private Album</span>
          </div>
        )}
      </div>
      {actions && <div className='absolute top-6 right-6'>{actions}</div>}
    </div>
  );
}
