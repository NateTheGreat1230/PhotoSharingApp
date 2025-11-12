export default function ErrorComponent({ message }: { message: string }) {
  return (
    <div className='flex-1 flex items-center justify-center bg-primary p-4 rounded-lg'>
      <div className='text-lg'>
        <span className='font-semibold'>Error:</span> {message}
      </div>
    </div>
  );
}
