"use client";

import ProductForm from "@/components/admin/ProductForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProductPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/admin/products/${params.id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="flex flex-col gap-4 text-foreground">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl text-foreground">Edit Product</h1>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <ProductForm initialData={product} />
            </div>
        </div>
    );
}
