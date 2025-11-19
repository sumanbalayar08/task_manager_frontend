import { useEffect, useState } from 'react'
import type { IPagination } from '../types/pagination.types'

export const getInitialPagination = (): IPagination => {
  const urlParams = new URLSearchParams(window.location.search)

  return {
    currentPage: parseInt(urlParams.get('page') || '1', 10),
    perPage: parseInt(urlParams.get('perPage') || '10', 10),
    searchTerm: urlParams.get('search') || '',
    total: parseInt(urlParams.get('total') || '1', 10),
    totalPages: parseInt(urlParams.get('totalPages') || '1', 10),
  }
}

const usePagination = (): [IPagination, React.Dispatch<React.SetStateAction<IPagination>>] => {
  const [pagination, setPagination] = useState<IPagination>(getInitialPagination)
  const [urlSync, setUrlSync] = useState(false)

  // Update URL params **inside useEffect** after render
  useEffect(() => {
    if (!urlSync) return // skip initial mount

    const urlParams = new URLSearchParams(window.location.search)

    if (pagination.currentPage > 1) urlParams.set('page', pagination.currentPage.toString())
    else urlParams.delete('page')

    if (pagination.perPage !== 10) urlParams.set('perPage', pagination.perPage.toString())
    else urlParams.delete('perPage')

    if (pagination.searchTerm) urlParams.set('search', pagination.searchTerm)
    else urlParams.delete('search')

    const newURL = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`
    window.history.replaceState({}, '', newURL)
  }, [pagination, urlSync])

  // Custom setPagination that triggers URL sync
  const setPaginationWithURLUpdate = (value: React.SetStateAction<IPagination>) => {
    setPagination(prevPagination => {
      let newPagination = typeof value === 'function' ? value(prevPagination) : value

      // Reset page to 1 if searchTerm changed
      if (newPagination.searchTerm !== prevPagination.searchTerm) {
        newPagination = { ...newPagination, currentPage: 1 }
      }

      setUrlSync(true) // trigger URL update in useEffect
      return newPagination
    })
  }

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const newPagination = getInitialPagination()
      setPagination(newPagination)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return [pagination, setPaginationWithURLUpdate]
}

export default usePagination
