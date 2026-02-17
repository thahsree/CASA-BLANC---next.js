import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  productId: string; // Shopify product ID
  authorName: string;
  email: string;
  rating: number; // 1-5
  title: string;
  content: string;
  images?: string[]; // Array of image URLs
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  ipAddress?: string;
  verified?: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: {
      type: String,
      required: [true, "Product ID is required"],
      index: true,
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Review content is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      select: false, // Don't return by default
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for faster queries by product and publication status
reviewSchema.index({ productId: 1, published: 1 });
// Optimization for sorting
reviewSchema.index({ productId: 1, createdAt: -1 });
// Prevent duplicate reviews from the same email for the same product
reviewSchema.index({ productId: 1, email: 1 }, { unique: true });
// Index for Rate Limiting (IP + createdAt)
reviewSchema.index({ ipAddress: 1, createdAt: -1 });

// Create or retrieve the Review model
const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;
