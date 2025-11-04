import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import type { ReactNode } from 'react';

export default function Modal({
  open,
  setOpen,
  title,
  children,
  closeText = 'Close',
  onClose,
  showClose = true,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  closeText?: string;
  onClose?: () => void;
  showClose?: boolean;
}) {
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
              {showClose && (
                <div className='pt-4 flex justify-end'>
                  <button
                    type='button'
                    onClick={() => {
                      setOpen(false);
                      onClose?.();
                    }}
                    className='btn-outline'
                  >
                    {closeText}
                  </button>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
