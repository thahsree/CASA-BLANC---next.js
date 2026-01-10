import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
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

    const query = {
      productId,
      published: true,
    };

    // Fetch paginated reviews for this product, sorted by newest first
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .maxTimeMS(8000);

    // Get total count and calculate stats more efficiently
    const totalReviews = await Review.countDocuments(query)
      .maxTimeMS(8000);
    
    // Get stats with timeout
    let stats = {
      totalReviews: 0,
      averageRating: 0,
      rating1: 0,
      rating2: 0,
      rating3: 0,
      rating4: 0,
      rating5: 0,
    };

    if (totalReviews > 0) {
      try {
        const statsResult = await Review.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              totalReviews: { $sum: 1 },
              averageRating: { $avg: "$rating" },
              rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
              rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
              rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
              rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
              rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
            },
          },
        ]);
        
        stats = statsResult[0] || stats;
      } catch (statsError) {
        console.warn("Stats calculation timed out, using basic calculation", statsError);
        // Fallback to simple calculation
        const allRatings = reviews.map((r) => r.rating);
        stats.totalReviews = totalReviews;
        stats.averageRating = allRatings.length > 0 
          ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length 
          : 0;
      }
    }

    const avgRating = stats.averageRating?.toFixed(2) || "0";

    return NextResponse.json({
      success: true,
      productId,
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
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await req.json();

    const { authorName, email, rating, title, content, images } = body;

    // Validation
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!authorName?.trim()) {
      return NextResponse.json(
        { error: "Author name is required" },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Review title is required" },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Review content is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create new review
    const newReview = new Review({
      productId,
      authorName: authorName.trim(),
      email: email.toLowerCase().trim(),
      rating: parseInt(rating),
      title: title.trim(),
      content: content.trim(),
      images: Array.isArray(images) ? images : [],
      published: false, // Default to unpublished, requires moderation
    });

    await newReview.save();

    console.log("✅ Review created successfully:", newReview._id);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully! It will be published after moderation.",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ POST /api/reviews error:", error);

    // Handle validation errors from Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((e: any) => e.message)
        .join(", ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
