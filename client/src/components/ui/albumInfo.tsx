export default function AlbumInfoCard({
  owner,
  title,
  created_at,
}: {
  owner: string;
  title: string;
  created_at: string;
}) {
  return (
    <div className='bg-white/5  backdrop-blur-md rounded-2xl p-6 shadow-lg mb-8 max-w-2xl mx-auto'>
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
      </div>
    </div>
  );
}
