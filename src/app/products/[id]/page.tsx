import SingleProductLanding from "@/components/SingleProductLanding";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = decodeURIComponent(params.id);

  await dbConnect();

  let product = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(id).lean();
  }

  if (!product) {
    product = await Product.findOne({ handle: id }).lean();
  }

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const productImage = product.images?.[0]?.url;

  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.description,
    openGraph: {
      images: productImage ? [productImage, ...previousImages] : previousImages,
    },
  };
}

export default function ProductByIdPage({ params }: Props) {
  const id = decodeURIComponent(params.id);
  console.log("ProductByIdPage rendering for id:", id);
  return (
    <main className="min-h-screen p-6 bg-[#0A0A0A] pt-24 text-white">
      <div className="max-w-5xl mx-auto">
        <SingleProductLanding id={id} />
      </div>
    </main>
  );
}
