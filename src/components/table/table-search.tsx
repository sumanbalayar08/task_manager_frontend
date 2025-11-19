import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { IPagination } from '../../types/pagination.types'

interface TableSearchProps {
  pagination?: IPagination
  setPagination?: React.Dispatch<React.SetStateAction<IPagination>>
  className?: string
  placeholder?: string
}

export function TableSearch({
  pagination,
  setPagination,
  className,
  placeholder = 'Search here...',
}: TableSearchProps) {
  const urlParams = new URLSearchParams(window.location.search)
  const timer = useRef<number | null>(null)
  const [searchTerm, setSearchTerm] = useState(urlParams.get('search') || '')
  const [mounted, setMounted] = useState(false)

  const handleInputChange = (e: string) => {
    setSearchTerm(e)
  }

  useEffect(() => {
    if (mounted) {
      timer.current = window.setTimeout(() => {
        if (pagination && setPagination) setPagination({ ...pagination, currentPage: 1, searchTerm })
      }, 500) as unknown as number

      return () => {
        if (timer.current) clearTimeout(timer.current)
      }
    } else {
      setMounted(true)
    }
  }, [searchTerm])

  return (
    <div
      className={`flex focus-within:border-blue-500  items-center border pr-2  rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5  bg-background   hover:text-accent-foreground ${className}`}
    >
      <input
        className='w-full px-1 focus:outline-none placeholder:text-[13px] text-[14px]'
        type='search'
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          handleInputChange(e.target?.value)
        }}
      />
      <Search className='h-4 w-4 text-gray-300 cursor-pointer ' />
    </div>
  )
}

export default TableSearch
