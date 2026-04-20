"use client";
"use no memo";

import { useRouter } from "next/navigation";
import * as React from "react";

import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState
} from "@tanstack/react-table";
import {
  PlusIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";

import { proposalSectionsColumns } from "./columns";
import type { ProposalSectionsRow } from "./schema";

const VIEW_OPTIONS = [
  { value: "outline", label: "Outline" },
  { value: "past-performance", label: "Past Performance" },
  { value: "key-personnel", label: "Key Personnel" },
  { value: "focus-documents", label: "Focus Documents" },
] as const;

type ViewOption = (typeof VIEW_OPTIONS)[number]["value"];

export function ProposalSectionsTable({ data: initialData }: { data: ProposalSectionsRow[] }) {
  const router = useRouter();

  const [activeView, setActiveView] = React.useState<ViewOption>("outline");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  

  const [data, setData] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    const fetchRatings = async () => {
      const token = localStorage.getItem("token");
   
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ratings/1?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      setData(result.ratings);
    };

    fetchRatings();
  }, [pagination]);

  const sortableId = React.useId();
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));



  const table = useReactTable({
    data,
    columns: proposalSectionsColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });


  return (
    <Tabs
      value={activeView}
      onValueChange={(value) => setActiveView(value as ViewOption)}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-end">
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/rating")}
          >
            <PlusIcon data-icon="inline-start" />
            <span className="hidden lg:inline">Add Rating</span>
          </Button>
        </div>

      </div>

      
    <div className="w-full border-amber-500">
  
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      
      {data?.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition duration-300"
        >
          {/* Image */}
          <img
            src={item.photo_url}
            alt="food"
            className="w-full h-48 object-cover"
          />

          {/* Content */}
          <div className="p-4">
            <h2 className="text-lg font-semibold capitalize">
              {item.meal_type}
            </h2>

            <p className="text-gray-600 mt-1">
              {item.comment}
            </p>

            {/* Rating */}
            <div className="flex items-center mt-2">
              ⭐ {item.rating} / 5
            </div>


            {/* Date */}
            <p className="text-sm text-gray-400 mt-2 flex justify-between ">
             <span >{item.date}</span> 
             <span className="text-end">{item.user_name} ({item.user_email})</span>
            </p>
          </div>
        </div>
      ))}

    </div>

    </div>
    </Tabs>
  );
}