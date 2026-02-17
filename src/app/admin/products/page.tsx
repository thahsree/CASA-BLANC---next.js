"use client";

import { Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  title: string;
  price: number;
  status: string;
  category?: string; // Add category field
  inventoryQuantity: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        setProducts(data.products || []);
    } catch (err) {
        console.error("Failed to fetch products", err);
    } finally {
        setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
      if (!confirm("Are you sure you want to delete this product?")) return;

      try {
          const res = await fetch(`/api/admin/products/${id}`, {
              method: "DELETE",
          });
          
          if (res.ok) {
              setProducts(products.filter(p => p._id !== id));
          } else {
              alert("Failed to delete product");
          }
      } catch (error) {
          console.error("Error deleting product:", error);
          alert("Error deleting product");
      }
  };

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="flex flex-col gap-4 text-[#000000] w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-[#FFFFFF]">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-green-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>
      
      <div className="rounded-md border bg-white">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">
                  Image
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                 <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Category
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Price
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
                {products.map((product) => (
                    <tr key={product._id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                            <div className="h-10 w-10 rounded bg-gray-100">
                                {/* Thumbnail logic here if internal images exist */}
                            </div>
                        </td>
                        <td className="p-4 align-middle font-medium">
                            {product.title}
                        </td>
                         <td className="p-4 align-middle text-muted-foreground">
                            {product.category || "-"}
                        </td>
                        <td className="p-4 align-middle">
                             <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {product.status}
                            </span>
                        </td>
                         <td className="p-4 align-middle">
                            ${product.price}
                        </td>
                        <td className="p-4 align-middle text-right">
                            <div className="flex justify-end gap-2">
                                <Link href={`/admin/products/${product._id}`} className="p-2 hover:bg-gray-100 rounded">
                                    <Pencil className="h-4 w-4" />
                                </Link>
                                <button 
                                    onClick={() => deleteProduct(product._id)}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded"
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
