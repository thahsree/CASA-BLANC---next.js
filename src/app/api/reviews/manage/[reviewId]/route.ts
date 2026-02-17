import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { reviewId: string } }
) {
    try {
        await connectToDatabase();
        const { reviewId } = params;

        if (!reviewId) {
            return NextResponse.json(
                { error: "Review ID is required" },
                { status: 400 }
            );
        }

        // 1. Get the review to know what to decrement
        const review = await Review.findById(reviewId);

        if (!review) {
            return NextResponse.json(
                { error: "Review not found" },
                { status: 404 }
            );
        }

        // Check authorization here if needed (e.g. session user == review.user)

        const { productId, rating } = review;

        // 2. Delete the review
        await Review.findByIdAndDelete(reviewId);

        // 3. Update Product Stats Atomically
        const ratingKey = `ratingStats.${rating}`;

        await Product.findByIdAndUpdate(productId, {
            $inc: {
                reviewCount: -1,
                ratingTotal: -rating,
                [ratingKey]: -1,
            },
        });

        return NextResponse.json({ success: true, message: "Review deleted successfully" });
    } catch (error: any) {
        console.error("DELETE /reviews/manage error:", error);
        return NextResponse.json(
            { error: "Failed to delete review" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { reviewId: string } }
) {
    try {
        await connectToDatabase();
        const { reviewId } = params;

        const body = await req.json();
        const { rating, title, content, images } = body;

        if (!reviewId) {
            return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
        }

        // 1. Get existing review
        const existingReview = await Review.findById(reviewId);
        if (!existingReview) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        const oldRating = existingReview.rating;
        const productId = existingReview.productId;
        const newRating = rating ? Number(rating) : oldRating;

        // 2. Update Review
        existingReview.title = title || existingReview.title;
        existingReview.content = content || existingReview.content;
        existingReview.images = images || existingReview.images;
        existingReview.rating = newRating;

        await existingReview.save();

        // 3. Update Product Stats only if rating changed
        if (newRating !== oldRating) {
            const oldRatingKey = `ratingStats.${oldRating}`;
            const newRatingKey = `ratingStats.${newRating}`;

            await Product.findByIdAndUpdate(productId, {
                $inc: {
                    ratingTotal: newRating - oldRating,
                    [oldRatingKey]: -1,
                    [newRatingKey]: 1,
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: "Review updated successfully",
            review: existingReview
        });

    } catch (error: any) {
        console.error("PATCH /reviews/manage error:", error);
        return NextResponse.json(
            { error: "Failed to update review" },
            { status: 500 }
        );
    }
}
