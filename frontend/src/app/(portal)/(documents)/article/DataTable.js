'use client';

import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import AddArticle from './AddArticle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { KmsAPIGET, KmsAPI } from '@/dep/kms/kmsHandler';
import PaginationCtrl from '@/components/Table/PaginationCtrl';
import { DeleteModal, alertDelete } from '@/components/Feature';

export default function DataTable() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [pageInfo, setPageInfo] = useState({ TotalPage: 0 });
  const columns = [
    {
      accessorKey: 'ArticleID',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('ArticleID')}</div>
      ),
    },
    {
      accessorKey: 'LastEditedTime',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          LastEditedTime
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('LastEditedTime')}</div>
      ),
    },
    {
      accessorKey: 'Tag',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tag
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue('Tag')}</div>,
    },
    {
      accessorKey: 'Title',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue('Title')}</div>,
    },
    {
      accessorKey: 'CategoryID',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          CategoryID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('CategoryID')}</div>
      ),
    },
    {
      accessorKey: 'IsActive',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          IsActive
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('IsActive')}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const items = row.original;
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        const [deletingArticleID, setDeletingArticleID] = useState(null);
        const [deleteMessage, setDeleteMessage] = useState('');
        const router = useRouter();
        const handleNavigate = (ArticleID) => {
          router.push(`/article/${ArticleID}`);
        };
        const handleConfirmDelete = async () => {
          try {
            const responseDel = await CoreAPI('DELETE', 'article', { ArticleID: deletingArticleID });
            alertDelete(responseDel);
            setIsDeleteModalOpen(false);
            setDeletingArticleID(null);
            fetchData();
          } catch (error) {
            console.error('Error deleting category:', error);
          }
        };
        return (
          <>
            {' '}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(items.ArticleID)}
                  className="hover:underline  hover:cursor-pointer"
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:underline hover:cursor-pointer" onClick={() => handleNavigate(items.ArticleID)}>View</DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:underline  hover:cursor-pointer hover:text-red-600"
                  onClick={() => {
                    setDeletingArticleID(items.ArticleID);
                    setDeleteMessage(
                      `Are you sure you would like to delete "${items.Title}" Article? This action cannot be undone.`,
                    );
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onDelete={handleConfirmDelete}
              message={deleteMessage}
            />
          </>

        );
      },
    },
  ];
  const fetchData = async () => {
    try {
      const response = await KmsAPIGET(`listarticle?page=${currentPage}&num=${itemsPerPage}`);
      setPageInfo(response.body.Info);
      setData(response.body.Data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Article Title..."
          value={(table.getColumn('Title')?.getFilterValue() ?? '')}
          onChange={(event) => table.getColumn('Title')?.setFilterValue(event.target.value)}
          className="max-w-sm bg-gray-100"
        />
        <div className=" ml-auto item-justify-end inline-flex">
          <AddArticle fetchData={fetchData} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className=" ml-2 bg-gray-100">
                Columns
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-100">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize hover:underline hover:cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border bg-gray-100">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((
                row,
              ) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex-1 text-sm font-medium text-muted-foreground">
          <div className="hidden lg:flex">
            Data show
            {' '}
            {pageInfo.LowerLimit}
            {' '}
            -
            {' '}
            {pageInfo.UpperLimit}
            {' '}
            of
            {' '}
            {pageInfo.TotalRow}
          </div>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="hidden lg:flex text-sm font-medium">Rows per page</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                const newItemsPerPage = Number(value);
                setItemsPerPage(newItemsPerPage);
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <PaginationCtrl
            currentPage={currentPage}
            totalPage={pageInfo.TotalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
