"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SortableImage } from "./SortableImage";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    actualPrice: initialData?.actualPrice || "",
    handle: initialData?.handle || "",
    category: initialData?.category || "",
    status: initialData?.status || "active",
    stock: initialData?.stock || "",
    stockLocation: initialData?.stockLocation || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
            const data = await res.json();
            setCategories(data);
        }
    } catch (error) {
        console.error("Failed to fetch categories", error);
        toast.error("Failed to load categories");
    }
  };

  const handleCreateCategory = async () => {
      try {
          const res = await fetch("/api/admin/categories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: newCategory }),
          });

          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "Failed to create category");

          toast.success("Category created!");
          setCategories([...categories, data]);
          setFormData({ ...formData, category: data.name });
          setIsCreatingCategory(false);
          setNewCategory("");
      } catch (error: any) {
          toast.error(error.message);
      }
  };
  interface ImageItem {
    url: string;
    isUploading: boolean;
    file?: File; // Keep reference if needed for retry, though not used here yet
    id: string; // Unique ID for dnd-kit
  }

  const [images, setImages] = useState<ImageItem[]>(
    initialData?.images?.map((img: any) => ({ url: img.url, isUploading: false, id: img.url })) || []
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  // Derived state for uploading
  const isUploading = images.some(img => img.isUploading);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper for character count
  const getCharacterCount = (text: string) => text ? text.length : 0;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  };
  const handleActualPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, actualPrice: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB limit (Cloudinary Free Tier)

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });
    
    // Create local previews and store files for later upload
    const newItems: ImageItem[] = validFiles.map(file => {
        const url = URL.createObjectURL(file);
        return {
          url,
          isUploading: false,
          file,
          id: url // using URL as ID for local images
        };
    });

    setImages(prev => [...prev, ...newItems]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload new images (those with 'file' property)
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            const data = new FormData();
            data.append("file", img.file);
            const res = await fetch("/api/upload", {
              method: "POST",
              body: data,
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Image upload failed");
            if (!json.url) throw new Error("Image upload failed: No URL returned");
            return { url: json.url, id: json.url };
          }
          return { url: img.url, id: img.id };
        })
      );

      // Auto-generate handle if missing
      const submitData = {
        ...formData,
        handle: formData.handle || formData.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
        images: uploadedImages,
        price: parseFloat(formData.price),
      };

      const url = initialData?._id
        ? `/api/admin/products/${initialData._id}`
        : "/api/admin/products";
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) throw new Error("Failed to save product");

      toast.success("Product saved!");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Product Name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium">Price</label>
                <input
                name="price"
                type="text"
                value={formData.price}
                onChange={handlePriceChange}
                placeholder="0.00"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                />
            </div>
             <div className="grid gap-2">
                <label className="text-sm font-medium">Actual Price</label>
                <input
                name="actualPrice"
                type="text"
                value={formData.actualPrice}
                onChange={handleActualPriceChange}
                placeholder="0.00"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="active" className="bg-background text-foreground">Active</option>
                    <option value="draft" className="bg-background text-foreground">Draft</option>
                    <option value="archived" className="bg-background text-foreground">Archived</option>
                </select>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                {!isCreatingCategory ? (
                    <div className="flex gap-2">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={(e) => {
                                if (e.target.value === "new") {
                                    setIsCreatingCategory(true);
                                } else {
                                    handleChange(e);
                                }
                            }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                            <option value="new" className="font-semibold text-primary">+ Create New Category</option>
                        </select>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter new category name"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        <button
                            type="button"
                            onClick={handleCreateCategory}
                            disabled={!newCategory.trim()}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCreatingCategory(false);
                                setNewCategory("");
                            }}
                            className="border border-input bg-background px-4 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
          </div>
          <div className="border border-border w-full px-4 py-2 rounded-md flex flex-col gap-2">
            <div>
              <h1 className="">Inventory</h1>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Stock Location</label>
                  <input
                name="stockLocation"
                type="text"
                value={formData.stockLocation}
                onChange={handleChange}
                placeholder="Enter the Location"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                />
                </div>
            </div>
            <div className="grid gap-2">
<div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Stock</label>
                  <input
                name="stock"
                type="text"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                />
                </div>
            </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium">Images</label>
                <div className="grid grid-cols-3 gap-2">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={images.map(img => img.id)}
                        strategy={rectSortingStrategy}
                      >
                        {images.map((img, i) => (
                           <SortableImage
                             key={img.id}
                             id={img.id}
                             url={img.url}
                             isUploading={img.isUploading}
                             onRemove={() => removeImage(i)}
                           />
                        ))}
                      </SortableContext>
                    </DndContext>
                    <label className="flex flex-col items-center justify-center aspect-square rounded-md border border-dashed hover:bg-muted/50 cursor-pointer border-input bg-transparent">
                        <span className="text-xs text-muted-foreground">{isUploading ? "Uploading..." : "+ Upload Images"}</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple
                            className="hidden" 
                            onChange={handleImageUpload} 
                            // Don't disable during upload to allow adding MORE images parallelly
                        />
                    </label>
                </div>
            </div>
        </div>
      </div>

      {/* Search Engine Listing */}
      <div className="border border-border w-full rounded-md flex flex-col gap-4 p-4 bg-card">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">Search engine listing</h1>
          <p className="text-sm text-muted-foreground">
            Add a title and description to see how this product might appear in a search engine listing
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Page title</label>
              <span className="text-xs text-muted-foreground">{getCharacterCount(formData.seoTitle)} of 70 characters used</span>
            </div>
            <input
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder="Page Title"
              maxLength={70}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Meta description</label>
              <span className="text-xs text-muted-foreground">{getCharacterCount(formData.seoDescription)} of 160 characters used</span>
            </div>
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              placeholder="Meta description"
              maxLength={160}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">URL handle</label>
            <div className="flex h-10 w-full rounded-md border border-input bg-background overflow-hidden ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
               <div className="flex items-center px-3 bg-muted text-muted-foreground border-r border-input text-sm whitespace-nowrap">
                  {origin ? `${origin}/products/` : "/products/"}
               </div>
               <input
                name="handle"
                value={formData.handle}
                onChange={handleChange}
                placeholder="url-handle"
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#C9B27B] text-black hover:bg-[#C9B27B]/90 h-10 px-4 py-2"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
