import Modal from './modal';

export default function ModalForm({
  open,
  setOpen,
  title,
  description,
  formFields,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onSubmit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  formFields: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
}) {
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={title}
      showClose={false}
      children={
        <>
          <p className='mb-4'>{description}</p>
          <div>{formFields}</div>
          <div className='pt-4 flex justify-end gap-3'>
            <button
              type='button'
              onClick={() => setOpen(false)}
              className='btn-outline'
            >
              {cancelText}
            </button>
            <button
              type='button'
              onClick={() => {
                onSubmit?.();
                setOpen(false);
              }}
              className='btn-primary'
            >
              {submitText}
            </button>
          </div>
        </>
      }
    />
  );
}
