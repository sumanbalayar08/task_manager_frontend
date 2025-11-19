import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { LoaderCircle } from "lucide-react";
import PaginationAction from "./pagination-action";
import type { IPagination } from '../../../types/pagination.types'

interface DataTablePaginationProps {
  pagination: IPagination;
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>;
  hideRowsPerPage?: boolean;
  hideTotal?: boolean;
  hidePages?: boolean;
  loading?: boolean;
}

export function DataTablePagination({
  pagination,
  setPagination,
  hideRowsPerPage,
  hideTotal,
  hidePages,
  loading,
}: DataTablePaginationProps) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between py-4 gap-3 ">
      {/* Left Controls */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
        {!hideRowsPerPage && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-slate-700">
              Rows per page
            </p>
            <Select
              value={pagination?.perPage?.toString()}
              onValueChange={(value: string) => {
                setPagination((prev) => ({
                  ...prev,
                  currentPage: 1,
                  perPage: Number(value),
                }));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-white border border-slate-300">
                <SelectValue placeholder={pagination?.perPage} />
              </SelectTrigger>
              <SelectContent side="top" className="bg-white border border-slate-300 shadow-lg">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {!hideTotal && (
          <div className="text-sm font-medium text-slate-700 whitespace-nowrap">
            Total {pagination?.total ?? 0} items
          </div>
        )}

        {!hidePages && (
          <div className="text-sm font-medium text-slate-700 whitespace-nowrap">
            {pagination?.totalPages ?? 1} pages
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <LoaderCircle className="h-4 w-4 animate-spin text-slate-400" />
        )}
        <PaginationAction pagination={pagination} setPagination={setPagination} />
      </div>
    </div>
  );
}
