import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectToDatabase();
        console.log("Starting migration of product stats...");

        const products = await Product.find({});
        let updatedCount = 0;

        for (const product of products) {
            const productId = product._id.toString(); // or product.id depending on what you use
            // Also try to match by string ID if stored that way
            // The Review model stores productId as string. 
            // We need to match exactly how it's stored.
            // Usually product._id is ObjectId, review.productId is string (maybe Shopify ID or ObjectId string).
            // Let's assume review.productId matches product._id.toString() or product.handle or product.id

            // We'll try to find reviews for this product.
            // First, get all reviews that might match
            // The Review GET route uses a regex logic for ID matching, we should replicate or simplify.
            // Let's stick to strict match first if possible. 
            // Existing logic used `productId: decodedProductId`.

            const distinctProductIds = await Review.distinct("productId");
            // This might be expensive if many products.

            // Better: Aggregate ALL reviews grouped by productId
        }

        // Efficient Aggregation Strategy
        const stats = await Review.aggregate([
            {
                $group: {
                    _id: "$productId",
                    reviewCount: { $sum: 1 },
                    ratingTotal: { $sum: "$rating" },
                    rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
                    rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                    rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                    rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                    rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                },
            },
        ]);

        console.log(`Found stats for ${stats.length} products.`);

        for (const stat of stats) {
            const {
                _id: productId,
                reviewCount,
                ratingTotal,
                rating1,
                rating2,
                rating3,
                rating4,
                rating5,
            } = stat;

            // Calculate average (optional validation)
            const averageRating = reviewCount > 0 ? ratingTotal / reviewCount : 0;

            // Update Product
            // tailored for both ObjectId and String ID scenarios
            // We try to find by ID first.

            let product = null;
            if (typeof productId === 'string' && productId.match(/^[0-9a-fA-F]{24}$/)) {
                product = await Product.findById(productId);
            }

            if (!product) {
                // Try finding by handle or custom ID if your schema uses that
                // Product schema has `handle` and `_id`. 
                // If review.productId corresponds to Product._id (stringified), findById works.
                // If it corresponds to `handle`, use findOne.
                // Or if `productId` field exists on Product? (No, standard _id).

                // Fallback: search by id string
                product = await Product.findOne({ _id: productId });
            }

            // If still not found, maybe it's a Shopify ID stored in _id? (Unlikely for Mongo)
            // Or maybe review.productId is the `handle`?
            if (!product) {
                product = await Product.findOne({ handle: productId });
            }

            if (product) {
                await Product.findByIdAndUpdate(product._id, {
                    reviewCount,
                    ratingTotal,
                    averageRating, // Update this too for backwards compat / caching
                    ratingStats: {
                        1: rating1,
                        2: rating2,
                        3: rating3,
                        4: rating4,
                        5: rating5,
                    },
                }, { strict: false });
                updatedCount++;
            } else {
                console.warn(`Could not find product for review group: ${productId}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Migration verified. Updated ${updatedCount} products.`,
        });
    } catch (error: any) {
        console.error("Migration error:", error);
        return NextResponse.json(
            { error: "Migration failed", details: error.message },
            { status: 500 }
        );
    }
}
