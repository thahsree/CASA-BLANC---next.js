"use client";
import SingleProductLanding from "@/components/SingleProductLanding";
import { useParams } from "next/navigation";

// Dynamic product page: /products/[id]
// Passes the URL param id to SingleProductLanding to fetch and render
export default function ProductByIdPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "";
  // Decode the ID in case it's URL-encoded (Next.js usually auto-decodes, but be explicit)
  const id = decodeURIComponent(rawId);
  console.log("ProductByIdPage rendering for id:", id);
  return (
    <main className="min-h-screen p-6 bg-[#0A0A0A] pt-24 text-white">
      <div className="max-w-5xl mx-auto">
        <SingleProductLanding id={id} />
      </div>
    </main>
  );
}
