import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showActions?: boolean;
}

export default function Modal({
  open,
  setOpen,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  showActions = true,
}: ModalProps) {
  return (
    <Dialog open={open} onClose={setOpen} className='relative z-50'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-black/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200'
      />

      <div className='fixed inset-0 z-50 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-xl bg-primary text-text shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95'
          >
            <div className='px-6 py-5'>
              {title && (
                <DialogTitle as='h3' className='text-lg font-semibold mb-3'>
                  {title}
                </DialogTitle>
              )}
              <div className='text-sm'>{children}</div>
            </div>

            {showActions && (
              <div className='px-4 py-3 flex justify-end gap-3'>
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
                    onConfirm?.();
                    setOpen(false);
                  }}
                  className='btn-primary'
                >
                  {confirmText}
                </button>
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
