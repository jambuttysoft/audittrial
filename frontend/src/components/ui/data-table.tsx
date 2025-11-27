import React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
  Row,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { Button } from './button'
import { Input } from './input'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu'
import { Checkbox } from './checkbox'

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  defaultVisibleColumnIds?: string[]
  storageKey?: string
  onRowClick?: (row: Row<TData>) => void
  bulkActions?: (selectedRows: Row<TData>[], clearSelection: () => void) => React.ReactNode
  getRowClassName?: (row: Row<TData>) => string
  onRowCountChange?: (count: number) => void
}

export function DataTable<TData, TValue>({ columns, data, defaultVisibleColumnIds, storageKey, onRowClick, bulkActions, getRowClassName, onRowCountChange }: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    try {
      if (storageKey) {
        const raw = localStorage.getItem(storageKey)
        if (raw) return JSON.parse(raw)
      }
    } catch {}
    if (defaultVisibleColumnIds && defaultVisibleColumnIds.length) {
      const ids = [
        ...columns.map((c) => (c.id as string) || (c as any).accessorKey).filter(Boolean),
      ] as string[]
      const vis: VisibilityState = {}
      ids.forEach((id) => {
        if (!defaultVisibleColumnIds.includes(id)) vis[id] = false
      })
      return vis
    }
    return {}
  })
  const [rowSelection, setRowSelection] = React.useState({})

  const selectionColumn = React.useMemo<ColumnDef<TData>>(
    () => ({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 48,
    }),
    []
  )

  const table = useReactTable({
    data,
    columns: [selectionColumn, ...columns],
    state: {
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? (updater as any)(columnVisibility) : updater
      setColumnVisibility(next)
      try {
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {}
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const rowCount = table.getRowModel().rows.length
  React.useEffect(() => {
    onRowCountChange?.(rowCount)
  }, [rowCount, onRowCountChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {table.getSelectedRowModel().rows.length > 0 && bulkActions ? (
          <div className="flex items-center gap-2">
            {bulkActions(table.getSelectedRowModel().rows, () => {
              table.resetRowSelection()
              setRowSelection({})
            })}
          </div>
        ) : (
          <>
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        <div className="ml-auto text-sm text-muted-foreground">
          Selected: {Object.keys(rowSelection).length}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }} className={(header.column.columnDef.meta as any)?.headerClassName as string}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} onClick={() => onRowClick?.(row)} className={(getRowClassName?.(row) || '') + ' cursor-pointer hover:bg-muted/50'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={(cell.column.columnDef.meta as any)?.cellClassName as string}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
