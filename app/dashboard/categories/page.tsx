"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ICategory } from "@/interfaces/categories";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getColumns } from "./features/columns";
import { DataTable } from "./features/data-table";

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({ name: "", description: "" });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICategory | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const buildQuery = () => {
    const query = new URLSearchParams();
    query.set("pagination[page]", page.toString());
    query.set("pagination[pageSize]", pageSize.toString());

    if (filters.name) {
      query.set("filters[name][$containsi]", filters.name);
    }

    if (filters.description) {
      query.set("filters[description][$containsi]", filters.description);
    }

    return query.toString();
  };

  const fetchData = () => {
    setLoading(true);
    axiosInstance
      .get(`/api/categories?${buildQuery()}`)
      .then((response) => {
        const apiData = response.data.data.map((item: ICategory) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          documentId: item.documentId,
        }));
        setCategories(apiData);
        setMeta(response.data.meta.pagination);
      })
      .catch((error) => {
        console.log("Failed to fetch categories:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/api/categories")
      .then((response) => {
        const apiData = response.data.data.map((item: ICategory) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          documentId: item.documentId,
        }));
        setCategories(apiData);
      })
      .catch((error) => {
        console.error("failed to fetch categories", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (item: ICategory) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      await axiosInstance.delete(`/api/categories/${item.documentId}`);
      await fetchData();
      toast.success("Category deleted successfully");
    } catch (error) {
      console.log("Delete failed: ", error);
      toast.error("Failed to delete category");
    }
  };

  const columns = getColumns(
    filters,
    handleFilterChange,
    (item) => {
      setSelectedItem(item);
      setSheetOpen(true);
    },
    handleDelete
  );

  return (
    <div className="py-4 md:py-6 px-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            <span>List of categories</span>
          </CardDescription>
          <CardAction>
            <Button>Add a new record</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <DataTable columns={columns} data={categories} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
