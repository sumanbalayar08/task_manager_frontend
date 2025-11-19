import type { IPagination } from '../../../types/pagination.types'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../ui/pagination'

interface IPaginationProps {
  pagination: IPagination
  setPagination: (data: IPagination) => void
}

const PaginationAction = ({ pagination, setPagination }: IPaginationProps) => {
  const nextFn = () => {
    if (pagination?.currentPage === pagination?.totalPages) return
    let tempCurrentPage = pagination.currentPage
    tempCurrentPage = tempCurrentPage + 1
    setPagination({ ...pagination, currentPage: tempCurrentPage })
  }

  const prevFn = () => {
    if (pagination?.currentPage === 1) return
    let tempCurrentPage = pagination.currentPage
    tempCurrentPage = tempCurrentPage - 1
    setPagination({ ...pagination, currentPage: tempCurrentPage })
  }

  const handlePage = (page: number) => {
    if (pagination?.currentPage === page) return
    setPagination({ ...pagination, currentPage: page })
  }

  const getVisiblePages = () => {
    const totalPages = pagination?.totalPages || 0
    const currentPage = pagination?.currentPage || 1
    const visiblePages = []

    // Always show first page
    visiblePages.push(1)

    if (currentPage > 4) {
      visiblePages.push('ellipsis')
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      visiblePages.push(i)
    }

    if (currentPage < totalPages - 3) {
      visiblePages.push('ellipsis')
    }

    // Always show last page
    if (totalPages > 1) {
      visiblePages.push(totalPages)
    }

    return visiblePages
  }

  return (
    <PaginationComponent>
      <PaginationContent>
        <PaginationItem key='previous'>
          <PaginationPrevious
            className={`${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => {
              prevFn()
            }}
          />
        </PaginationItem>

        {getVisiblePages().map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                onClick={() => {
                  handlePage(page as number)
                }}
                className={`${page === pagination?.currentPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem
          onClick={() => {
            nextFn()
          }}
          key='next'
        >
          <PaginationNext
            className={`
              ${pagination.currentPage >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  )
}

export default PaginationAction
