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

    // Fetch published reviews for this product, sorted by newest first
    const reviews = await Review.find({
      productId,
      published: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get all reviews for stats calculation
    const allReviews = await Review.find({
      productId,
      published: true,
    }).lean();

    // Calculate average rating
    const avgRating =
      allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2)
        : 0;

    return NextResponse.json({
      success: true,
      productId,
      data: reviews,
      stats: {
        totalReviews: allReviews.length,
        averageRating: parseFloat(avgRating as string),
        ratingDistribution: {
          1: allReviews.filter((r) => r.rating === 1).length,
          2: allReviews.filter((r) => r.rating === 2).length,
          3: allReviews.filter((r) => r.rating === 3).length,
          4: allReviews.filter((r) => r.rating === 4).length,
          5: allReviews.filter((r) => r.rating === 5).length,
        },
      },
      pagination: {
        page,
        limit,
        total: allReviews.length,
        pages: Math.ceil(allReviews.length / limit),
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
