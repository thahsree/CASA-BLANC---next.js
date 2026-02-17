import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  try {
    await dbConnect();

    // Try finding by ID first if it looks like an ObjectId
    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).lean();
    }

    // If not found by ID, try handle
    if (!product) {
      product = await Product.findOne({ handle: id }).lean();
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate dynamic average rating
    const reviewCount = product.reviewCount || 0;
    const ratingTotal = product.ratingTotal || 0;
    const averageRating = reviewCount > 0 ? ratingTotal / reviewCount : 0;

    const productWithStats = {
      ...product,
      averageRating: parseFloat(averageRating.toFixed(2))
    };

    return NextResponse.json({ product: productWithStats });
  } catch (error: any) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}
