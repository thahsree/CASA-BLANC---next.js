import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Simple pagination / filtering could be added here
    const products = await Product.find({ status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    // Transform to match expected frontend shape if necessary, 
    // or just return the array. For now returning simple JSON.
    // Explicitly wrapping in { products: [...] } because the frontend likely expects that shape 
    // based on previous Shopify structure, or we can adapt frontend. 
    // Given the task is to "change that setup to full next.js app", I will return clean JSON.
    // But to match the previous route response structure ({ products: ... }), I'll keep it wrapping.

    // Calculate average rating dynamically for each product
    const productsWithStats = products.map((product: any) => {
      const reviewCount = product.reviewCount || 0;
      const ratingTotal = product.ratingTotal || 0;
      const averageRating = reviewCount > 0 ? ratingTotal / reviewCount : 0;

      // DEBUG: Log stats for problem products
      if (reviewCount > 0 && averageRating === 0) {
        console.log(`Product ${product._id} Stats Mismatch:`, {
          reviewCount,
          ratingTotal,
          dbAverageRating: product.averageRating,
          calcAverageRating: averageRating
        });
      }

      return {
        ...product,
        averageRating: parseFloat(averageRating.toFixed(2))
      };
    });

    return NextResponse.json({ products: productsWithStats });
  } catch (error: any) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
