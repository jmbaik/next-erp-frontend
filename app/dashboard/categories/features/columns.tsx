"use client";

import ColumnFilter from "@/components/ColumnFilter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ICategory } from "@/interfaces/categories";
import { IconDotsVertical } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  name: string;
  description: string;
};

// -- : ColumnDef<CategoryColumn>[]
const columnHelper = createColumnHelper<CategoryColumn>();

export const getColumns = (
  filters: CategoryColumn,
  handleFilterChange: (name: string, val: string) => void,
  onEdit: (val: ICategory) => void,
  onDelete: (val: ICategory) => Promise<void>
) => [
  columnHelper.accessor("name", {
    header: () => {
      return (
        <ColumnFilter
          label="Name"
          value={filters.name || ""}
          placeholder="Filter name..."
          onChange={() => {}}
        />
      );
    },
    cell: (info) => info.getValue(),
  }),
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
