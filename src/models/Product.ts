import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProductVariant {
    _id: mongoose.Types.ObjectId;
    title: string; // e.g., "Size: M / Color: Blue"
    price: number;
    compareAtPrice?: number;
    inventoryQuantity: number;
    sku?: string;
    options: Record<string, string>; // e.g., { "Size": "M", "Color": "Blue" }
}

export interface IProductImage {
    url: string;
    altText?: string;
    publicId?: string; // Cloudinary ID
}

export interface IProduct extends Document {
    title: string;
    description: string;
    handle: string; // URL slug
    price: number;
    compareAtPrice?: number;
    images: IProductImage[];
    variants: IProductVariant[];
    options: {
        name: string; // e.g., "Size"
        values: string[]; // e.g., ["S", "M", "L"]
    }[];
    category?: string;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    status: "active" | "draft" | "archived";
    stockLocation?: string;
    averageRating?: number;
    reviewCount?: number;
    ratingStats?: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    ratingTotal?: number;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        seoTitle: {
            type: String,
            trim: true,
        },
        seoDescription: {
            type: String,
            trim: true,
        },
        handle: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        compareAtPrice: {
            type: Number,
            min: 0,
        },
        images: [
            {
                url: { type: String, required: true },
                altText: String,
                publicId: String,
            },
        ],
        variants: [
            {
                title: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
                compareAtPrice: { type: Number, min: 0 },
                inventoryQuantity: { type: Number, default: 0 },
                sku: String,
                options: { type: Map, of: String },
            },
        ],
        options: [
            {
                name: String,
                values: [String],
            },
        ],
        category: {
            type: String,
            index: true,
        },
        tags: [String],
        status: {
            type: String,
            enum: ["active", "draft", "archived"],
            default: "active",
            index: true,
        },
        stockLocation: {
            type: String,
            trim: true,
            index: true,
        },
        averageRating: {
            type: Number,
            default: 0,
            index: true,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        ratingStats: {
            type: {
                1: { type: Number, default: 0 },
                2: { type: Number, default: 0 },
                3: { type: Number, default: 0 },
                4: { type: Number, default: 0 },
                5: { type: Number, default: 0 },
            },
            default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
        ratingTotal: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for searching/filtering
productSchema.index({ "variants.price": 1 });

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
