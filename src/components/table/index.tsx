"use client";

import React, { useState, type ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

import { LoaderCircle, Plus, Filter } from "lucide-react";
import { DataTablePagination } from "./pagination";
import TableSearch from "./table-search";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { IPagination } from "../../types/pagination.types";
import NoData from "../ui/no-data";
import { TableRow } from "../ui/table";
import { TableBody } from "../ui/table";
import { TableHead } from "../ui/table";
import { TableHeader } from "../ui/table";
import { TableCell } from "../ui/table";
import { Table as CTable } from "../ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  pagination?: IPagination;
  setPagination?: React.Dispatch<React.SetStateAction<IPagination>>;
  hidePagination?: boolean;
  showSearch?: boolean;
  addButton?: boolean;
  setAddOpen?: (open: boolean) => void;
  addButtonLabel?: string;
  addButtonIcon?: ReactNode;
  tools?: ReactNode;
  toolsButtonLabel?: string;
  placeholder?: string;
}

function Table<TData, TValue>({
  columns,
  data,
  loading = false,
  pagination,
  setPagination,
  hidePagination,
  showSearch = true,
  addButton,
  setAddOpen,
  addButtonLabel,
  addButtonIcon,
  tools,
  toolsButtonLabel,
  placeholder,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        {showSearch && pagination && setPagination && (
          <TableSearch
            pagination={pagination}
            setPagination={setPagination}
            placeholder={placeholder ?? "Search..."}
            className="xl:w-[400px] lg:w-[300px] h-10 md:w-[250px]"
          />
        )}

        <div className="flex gap-2 flex-wrap">
          {addButton && setAddOpen && (
            <Button
              onClick={() => setAddOpen(true)}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 shadow-sm transition-all hover:shadow-md"
            >
              {addButtonIcon ?? <Plus size={18} />}
              <span className="md:flex hidden ml-2">{addButtonLabel ?? "Add"}</span>
            </Button>
          )}

          {tools && (
            <Popover >
              <PopoverTrigger asChild className="bg-white">
                <Button variant="outline" size="sm" className="h-10 flex items-center border-slate-300">
                  <Filter size={18} />
                  <span className="md:flex hidden ml-2">{toolsButtonLabel ?? "Filter"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4">{tools}</PopoverContent>
            </Popover>
          )}

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <CTable className="w-full min-w-max">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-slate-50 border-b border-slate-200">
                  <TableCell className="text-center w-[40px] font-semibold text-slate-700">SN</TableCell>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className="font-semibold text-slate-700">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <LoaderCircle className="animate-spin h-6 w-6 text-blue-600" />
                      <span className="text-sm text-slate-600 font-medium">Loading data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50 border-b border-slate-100 transition-colors"
                  >
                    <TableCell className="text-center text-slate-600 font-medium">
                      {String(
                        index + 1 + ((pagination?.currentPage || 1) - 1) * (pagination?.perPage || 0)
                      ).padStart(2, "0")}
                      .
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="overflow-hidden text-ellipsis">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1}>
                    <div className="flex h-48 items-center justify-center">
                      <NoData message="No data available" description="Please add entries or refresh." />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </CTable>
        </div>
      </div>

      {/* Pagination */}
      {!hidePagination && pagination && setPagination && (
        <DataTablePagination pagination={pagination} setPagination={setPagination} />
      )}
    </div>
  );
}

export default Table;
