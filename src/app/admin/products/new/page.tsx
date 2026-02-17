import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-4 text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Create Product</h1>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <ProductForm />
      </div>
    </div>
  );
}
