import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    // Decode the product ID
    const decodedProductId = decodeURIComponent(productId);

    console.log("Reviews API - Raw productId:", productId);
    console.log("Reviews API - Decoded productId:", decodedProductId);

    if (!decodedProductId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get pagination from query params
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Try multiple query formats to handle different ID formats
    const queries = [
      { productId: decodedProductId, published: true }, // Exact match
      // Also try matching if decodedProductId is numeric and stored ID is full Shopify ID
      ...(decodedProductId.match(/^\d+$/) ? [
        { productId: new RegExp(decodedProductId), published: true } // Regex match for numeric IDs
      ] : [])
    ];

    let reviews: any[] = [];
    let totalReviews = 0;
    let stats = {
      totalReviews: 0,
      averageRating: 0,
      rating1: 0,
      rating2: 0,
      rating3: 0,
      rating4: 0,
      rating5: 0,
    };

    // Try each query format
    for (const query of queries) {
      console.log("Reviews API - Trying query:", query);

      // Fetch paginated reviews for this product, sorted by newest first
      const foundReviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .maxTimeMS(8000);

      // Get total count (for pagination)
      const foundTotal = await Review.countDocuments(query)
        .maxTimeMS(8000);

      if (foundReviews.length > 0 || foundTotal > 0) {
        reviews = foundReviews;
        totalReviews = foundTotal;

        // Fetch Product for correct stats (Buckets Strategy)
        // We do this inside the loop only if we found reviews or are about to return empty for a valid product
        // But optimally we should just fetch the product once. 
        // Refactoring to fetch product stats regardless of reviews existence, if possible.
        // But user instructions for stats were specific. 
        // Let's implement dynamic calculation here.

        const Product = (await import("@/models/Product")).default;
        const product = await Product.findById(decodedProductId).lean();

        if (product) {
          const rCount = product.reviewCount || 0;
          const rTotal = product.ratingTotal || 0;
          const avg = rCount > 0 ? rTotal / rCount : 0;

          stats = {
            totalReviews: rCount,
            averageRating: avg,
            rating1: product.ratingStats?.[1] || 0,
            rating2: product.ratingStats?.[2] || 0,
            rating3: product.ratingStats?.[3] || 0,
            rating4: product.ratingStats?.[4] || 0,
            rating5: product.ratingStats?.[5] || 0,
          };
        }

        break; // Found reviews, stop trying other queries
      }
    }

    const avgRating = stats.averageRating?.toFixed(2) || "0";

    return NextResponse.json({
      success: true,
      productId: decodedProductId,
      data: reviews,
      stats: {
        totalReviews,
        averageRating: parseFloat(avgRating),
        ratingDistribution: {
          1: stats.rating1 || 0,
          2: stats.rating2 || 0,
          3: stats.rating3 || 0,
          4: stats.rating4 || 0,
          5: stats.rating5 || 0,
        },
      },
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit),
      },
    });
  } catch (error) {
    console.error("❌ GET /api/reviews/[productId] error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Failed to fetch reviews", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await connectToDatabase();

    const { productId } = params;
    const decodedProductId = decodeURIComponent(productId);

    const body = await req.json();
    const { authorName, email, rating, title, content, images } = body;

    // -------- Basic Validation --------
    if (!decodedProductId)
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    if (!authorName?.trim())
      return NextResponse.json({ error: "Author name required" }, { status: 400 });

    if (!email?.trim())
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    if (!rating || rating < 1 || rating > 5)
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });

    if (!title?.trim())
      return NextResponse.json({ error: "Title required" }, { status: 400 });

    if (!content?.trim())
      return NextResponse.json({ error: "Content required" }, { status: 400 });

    // -------- Create Review --------
    // We rely on unique index (productId + email) for duplicate prevention.
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0];

    const newReview = await Review.create({
      productId: decodedProductId,
      authorName: authorName.trim(),
      email: email.toLowerCase().trim(),
      rating: Number(rating),
      title: title.trim(),
      content: content.trim(),
      images: Array.isArray(images) ? images : [],
      published: true,
      ipAddress: ip,
    });

    // -------- Atomic Product Update --------
    const Product = (await import("@/models/Product")).default;

    const ratingKey = `ratingStats.${rating}`;

    const updatedProduct = await Product.findByIdAndUpdate(
      decodedProductId,
      {
        $inc: {
          reviewCount: 1,
          ratingTotal: Number(rating),
          [ratingKey]: 1,
        },
      },
      { new: true, strict: false } // strict: false ensures ratingTotal is written even if schema is stale
    );

    if (!updatedProduct) {
      console.error("Product not found for review:", decodedProductId);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /reviews error:", error);

    // Duplicate review (unique index)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You have already reviewed this product." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
