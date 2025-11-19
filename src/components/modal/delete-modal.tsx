import { LoaderCircle, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'

interface DeleteModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  onDelete: () => void
  loading: boolean
  title?: string
  description?: string
  buttonLabel?: string
  loadingButtonLabel?: string
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  setOpen,
  onDelete,
  loading,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item?',
  buttonLabel = 'Delete',
  loadingButtonLabel = 'Deleting...',
}) => {
  const [confirm, setConfirm] = useState(false)

  const memoizedOnDelete = useMemo(() => onDelete, [onDelete])

  useEffect(() => {
    if (confirm) {
      void (async () => {
        try {
          await memoizedOnDelete()
          toast.success("Deleted Successfully")
        } catch (err: unknown) {
          toast.error("Failed to delete")
        } finally {
          setConfirm(false)
          setOpen(false)
        }
      })()
    }
  }, [confirm])

  if (!open) return null

  return (
    <div className='fixed inset-0 z-[1000] backdrop-blur-sm bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-300'>
      <div className='flex flex-col max-w-[420px] w-full bg-white rounded-lg shadow-xl border relative overflow-hidden animate-in zoom-in-95 duration-300'>
        <div className='flex items-center justify-between p-6 border-b'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
              <Trash2 className='w-5 h-5 text-red-600' />
            </div>
            <h2 className='text-lg  text-gray-900'>{title || 'Confirm Delete'}</h2>
          </div>

          <button
            type='button'
            className='w-8 h-8 cursor-pointer hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200'
            onClick={() => setOpen(false)}
          >
            <X className='w-4 h-4 text-gray-500' />
          </button>
        </div>

        <div className='p-6'>
          <p className='text-gray-700 text-left mb-2'>
            {description || 'Are you sure you want to delete this item?'}
          </p>

          <div className='mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
            <p className='text-sm text-amber-800 font-medium flex items-center gap-2'>
              <span className='w-1.5 h-1.5 bg-amber-500 rounded-full'></span>
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className='px-6 pb-6 flex gap-3 justify-end'>
          <Button variant='outline' onClick={() => setOpen(false)} disabled={loading} className='cursor-pointer'>
            Cancel
          </Button>
          <Button disabled={loading} onClick={() => setConfirm(true)} variant='destructive' className='cursor-pointer'>
            {loading ? <LoaderCircle className='animate-spin' /> : <Trash2 />}
            {loading ? loadingButtonLabel : buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
