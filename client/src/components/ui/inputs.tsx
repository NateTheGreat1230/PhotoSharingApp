export function TextInput({
  label,
  error,
  placeholder,
  required,
}: {
  label?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label className='text-sm font-medium text-text'>
          {label} {required && <span className='text-accent'>*</span>}
        </label>
      )}
      <input
        placeholder={placeholder}
        required={required}
        className={`rounded-md px-3 py-2 border ${
          error ? 'border-red-500' : 'border-accent/50'
        } bg-background text-text focus:outline-none focus:border-accent`}
      />
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
