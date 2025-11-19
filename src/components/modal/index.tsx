import { X } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'

const Modal = ({
  open,
  setOpen,
  title,
  children,
  size = 'md',
  hideCloseButton,
  closeOnOutsideClick = false,
  onHandleClose,
  nested = false,
  customZIndex = 'z-[1000]',
}: {
  open: boolean
  setOpen?: (data: boolean) => void
  title?: string
  children?: ReactNode
  size?: 'sm' | 'md' | 'xl' | 'lg'
  hideCloseButton?: boolean
  closeOnOutsideClick?: boolean
  onHandleClose?: () => void
  nested?: boolean
  customZIndex?: string
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [wasOpen, setWasOpen] = useState(open)
  const closeTriggeredRef = useRef(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeTriggeredRef.current = true
        if (setOpen) setOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeTriggeredRef.current = true
        if (setOpen) setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [open, setOpen])

  useEffect(() => {
    if (wasOpen && !open) {
      if (onHandleClose) onHandleClose()
      closeTriggeredRef.current = false
    }
    setWasOpen(open)
  }, [open, wasOpen, onHandleClose])

  if (!open) return null

  const handleModalClose = () => {
    closeTriggeredRef.current = true
    if (setOpen) setOpen(false)
  }

  // Different z-index and backdrop for nested modals
  const zIndex = nested ? 'z-[1001]' : customZIndex

  // For nested modals, we don't add backdrop to the entire page
  // Instead, we'll rely on the parent modal's backdrop
  const backdropClass = nested ? 'bg-black/30' : 'bg-black/60 backdrop-blur-sm'

  return (
    <div
      className={`fixed inset-0 ${zIndex} ${backdropClass} flex items-center justify-center p-4 animate-in fade-in duration-300 `}
    >
      <div
        ref={closeOnOutsideClick ? modalRef : null}
        className={`
          ${size == 'sm'
            ? 'lg:w-1/3 md:w-[60%] w-[98%]'
            : size === 'md'
              ? 'lg:w-1/2 md:[80%] w-[98%]'
              : size === 'xl'
                ? 'md:w-[85%] w-[98%]'
                : 'md:w-[90%] w-[98%]'
          }
          flex flex-col  w-full bg-white text-gray-900 rounded-lg shadow-xl border relative overflow-hidden animate-in zoom-in-95 duration-300`}
      >
        {title && (
          <div className='flex items-center justify-between p-6 border-b '>
            <div className='flex items-center gap-3'>
              <h2 className='text-lg  text-gray-900'>{title}</h2>
            </div>

            {!hideCloseButton && (
              <button
                type='button'
                className='w-8 h-8 cursor-pointer hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200'
                onClick={handleModalClose}
              >
                <X className='w-4 h-4 text-gray-500' />
              </button>
            )}
          </div>
        )}

        <div className='py-6'>
          <div className='max-h-[80vh] px-6 pb-2'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
