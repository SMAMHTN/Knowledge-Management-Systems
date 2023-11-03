'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowUpDown, ChevronDown, MoreHorizontal, Check, X, Search,
} from 'lucide-react';
import AddUser from './AddUser';
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
import { CoreAPI, CoreAPIGET } from '@/dep/core/coreHandler';
import PaginationCtrl from '@/components/Table/PaginationCtrl';
import { DeleteModal, alertDelete } from '@/components/Feature';
import { URLParamsBuilder, HandleQueryParams, HandleSortParams } from '@/dep/others/HandleParams';

export default function DataTable() {
  const [data, setData] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageInfo, setPageInfo] = useState({ TotalPage: 1 });
  let currentPage = searchParams.get('page') || 1;
  let itemsPerPage = searchParams.get('num') || 5;
  const q = searchParams.get('query');
  const [queries, setQueries] = useState('');
  const filterRef = useRef();
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [sortParams, setSortParams] = useState(null);
  const SortPass = searchParams.get('sort');

  const fetchData = async (page = searchParams.get('page'), num = searchParams.get('num'), search = searchParams.get('query'), sortPass = searchParams.get('sort')) => {
    let response;
    try {
      let queriesencoded = null;
      let sortencoded = null;

      if (search !== null) {
        queriesencoded = encodeURIComponent(search);
      }

      if (sortPass !== null) {
        sortencoded = encodeURIComponent(sortPass);
      }
      response = await CoreAPIGET(URLParamsBuilder('listuser', page, num, queriesencoded, sortencoded));
      setPageInfo(response.body.Info);
      setData(response.body.Data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  function SingleSortToggle(FieldName) {
    let newSortField; let
      newSortAsc;

    if (sortField === FieldName) {
      newSortField = FieldName;
      newSortAsc = !sortAsc;
    } else {
      newSortField = FieldName;
      newSortAsc = false;
    }

    setSortField(newSortField);
    setSortAsc(newSortAsc);
    const newSortParams = HandleSortParams(newSortField, newSortAsc);
    setSortParams(newSortParams);
  }

  const columns = [
    {
      accessorKey: 'Name',
      header: ({ column }) => (
        <Button
          className="hover:bg-gray-300"
          variant="ghost"
          onClick={() => SingleSortToggle('Name')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.getValue('Name')}</div>,
    },
    {
      accessorKey: 'IsActive',
      header: ({ column }) => (
        <div>Status</div>
      ),
      cell: ({ row }) => (
        <div className="text text-justify items-center align-middle">
          {row.getValue('IsActive') ? (
            <Check size={16} color="green" />
          ) : (
            <X size={16} color="red" />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'RoleName',
      header: ({ column }) => (
        <Button
          className="hover:bg-gray-300"
          variant="ghost"
          onClick={() => SingleSortToggle('RoleName')}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.getValue('RoleName')}</div>,
    },
    {
      accessorKey: 'Email',
      header: ({ column }) => (
        <div>Email</div>
      ),
      cell: ({ row }) => <div>{row.getValue('Email')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const items = row.original;
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        const [deletingUserID, setDeletingUserID] = useState(null);
        const [deleteMessage, setDeleteMessage] = useState('');
        const router = useRouter();
        const handleNavigate = (UserID) => {
          router.push(`/user/${UserID}`);
        };
        const handleConfirmDelete = async () => {
          try {
            const responseDel = await CoreAPI('DELETE', 'user', { UserID: deletingUserID });
            alertDelete(responseDel);
            setIsDeleteModalOpen(false);
            setDeletingUserID(null);
            fetchData();
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        };
        return (
          <>
            {' '}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:border-gray-400 hover:border hover:rounded-md">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-300" />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(items.UserID)}
                  className="hover:underline hover:cursor-pointer"
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:underline hover:cursor-pointer" onClick={() => handleNavigate(items.UserID)}>View</DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:underline hover:text-red-600 hover:cursor-pointer"
                  onClick={() => {
                    setDeletingUserID(items.UserID);
                    setDeleteMessage(
                      `Are you sure you would like to delete "${items.Name}" as user? This action cannot be undone.`,
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

  useEffect(() => {
    fetchData(currentPage, itemsPerPage, q, SortPass);
    let queriesencoded = null; // Declare queriesencoded outside the if block
    let sortencoded = null;

    if (q !== null) {
      queriesencoded = encodeURIComponent(q);
    }

    if (SortPass !== null) {
      sortencoded = encodeURIComponent(SortPass);
    }

    router.push(
      URLParamsBuilder('', currentPage, itemsPerPage, queriesencoded, sortencoded),
      { scroll: false },
    );
  }, [currentPage, itemsPerPage, q, SortPass]);

  useEffect(() => {
    fetchData(currentPage, itemsPerPage, q);
    fetchData(currentPage, itemsPerPage, q, sortParams);
    let queriesencoded = null; // Declare queriesencoded outside the if block

    if (q !== null) {
      queriesencoded = encodeURIComponent(q);
    }

    router.push(
      URLParamsBuilder('', currentPage, itemsPerPage, queriesencoded, sortParams),
      { scroll: false },
    );
  }, [sortParams]);

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
    currentPage = newPage;
    let queriesencoded = null;
    let sortencoded = null;

    if (q !== null) {
      queriesencoded = encodeURIComponent(q);
    }

    if (SortPass !== null) {
      sortencoded = encodeURIComponent(SortPass);
    }
    router.push(URLParamsBuilder('', newPage, itemsPerPage, queriesencoded, sortencoded));
  };

  const handleFilterChange = () => {
    const userInput = filterRef.current.value;
    const newQ = encodeURIComponent(JSON.stringify([{
      field: 'Name',
      operator: 'LowerLIKE',
      logic: 'AND',
      values: [`%${userInput}%`],
    }]));
    setQueries(newQ);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Roles Name..."
          onChange={handleFilterChange}
          ref={filterRef}
          className="max-w-sm bg-gray-100"
        />
        <Button variant="outline" className=" px-2 ml-2 bg-gray-100  hover:bg-gray-300">
          <Link href={URLParamsBuilder('/user', 1, itemsPerPage, queries, sortParams)}>
            <Search className="hidden lg:flex" size={24} />
            <Search className="flex lg:hidden" size={20} />
          </Link>
        </Button>
        <div className=" ml-auto item-justify-end inline-flex">
          <AddUser fetchData={fetchData} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className=" ml-2 bg-gray-100 hover:bg-gray-300">
                Show
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
      <div className="rounded-md border bg-gray-100 py-2">
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
            {data !== null ? (table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((
                row,
              ) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-gray-300 rounded"
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
            )) : (
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
        <div className="flex-1 text-sm font-medium text-muted-foregroud">
          <div className="hidden sm:flex">
            {pageInfo.LowerLimit !== undefined && pageInfo.UpperLimit !== undefined && (
            <span>
              Data show
              {' '}
              {pageInfo.LowerLimit === 0 && pageInfo.UpperLimit === 0
                ? '0'
                : `${pageInfo.LowerLimit} - ${pageInfo.UpperLimit}`}
                {' '}
              of
              {' '}
              {pageInfo.TotalRow}
            </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="hidden lg:flex text-sm font-medium">Rows per page</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                const newItemsPerPage = Number(value);
                itemsPerPage = newItemsPerPage;
                router.push(URLParamsBuilder('', 1, itemsPerPage, queries, sortParams));
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
            currentPage={Number(currentPage)}
            totalPage={pageInfo.TotalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}