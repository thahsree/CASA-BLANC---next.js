import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category"; // Ensure this import exists
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Basic validation
        if (!body.title || !body.price || !body.images || body.images.length === 0) {
            return NextResponse.json(
                { error: "Missing required fields (title, price, images)" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Auto-generate default variant if none provided (Simple Product)
        if (!body.variants || body.variants.length === 0) {
            body.variants = [{
                title: "Default Title",
                price: body.price,
                inventoryQuantity: body.stock ? parseInt(body.stock) : 0, // Use provided stock
                options: {}
            }];
        }

        // Map frontend fields to schema fields
        const productData = {
            ...body,
            compareAtPrice: body.actualPrice, // Map actualPrice to compareAtPrice
            stockLocation: body.stockLocation, // Ensure stockLocation is passed explicitly
            // Sanitize description to prevent layout issues
            description: body.description ? body.description.replace(/&nbsp;/g, ' ') : body.description,
            descriptionHtml: body.descriptionHtml ? body.descriptionHtml.replace(/&nbsp;/g, ' ') : body.descriptionHtml,
        };

        const newProduct = await Product.create(productData);

        // Link product to category if provided
        if (body.category) {
            await Category.findOneAndUpdate(
                { name: body.category },
                { $addToSet: { products: newProduct._id } }
            );
        }

        return NextResponse.json({ product: newProduct }, { status: 201 });
    } catch (error: any) {
        console.error("Product creation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create product" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch all products (including drafts/archived) for admin
        const products = await Product.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ products });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch products" },
            { status: 500 }
        );
    }
}
