import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        await dbConnect();

        const product = await Product.findById(id).lean();

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Map backend fields to frontend expected format
        const formattedProduct = {
            ...product,
            actualPrice: product.compareAtPrice,
            stock: (product.variants && product.variants.length > 0) ? product.variants[0].inventoryQuantity : 0,

        };

        return NextResponse.json(formattedProduct);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch product" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await req.json();
        await dbConnect();

        const oldProduct = await Product.findById(id);
        if (!oldProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Handle Category Change
        if (oldProduct.category !== body.category) {
            // Remove from old category
            if (oldProduct.category) {
                await Category.findOneAndUpdate(
                    { name: oldProduct.category },
                    { $pull: { products: id } }
                );
            }
            // Add to new category
            if (body.category) {
                await Category.findOneAndUpdate(
                    { name: body.category },
                    { $addToSet: { products: id } }
                );
            }
        }

        // Map frontend fields to schema fields for update
        const updateData = {
            ...body,
            compareAtPrice: body.actualPrice,
            stockLocation: body.stockLocation,
            // Sanitize description to prevent layout issues
            description: body.description ? body.description.replace(/&nbsp;/g, ' ') : body.description,
            descriptionHtml: body.descriptionHtml ? body.descriptionHtml.replace(/&nbsp;/g, ' ') : body.descriptionHtml,
        };

        // If simple product (checking variants), update the default variant's stock
        if (body.stock !== undefined && (!oldProduct.variants || oldProduct.variants.length <= 1)) {
            // Ensure variants array exists
            if (!updateData.variants) {
                updateData.variants = oldProduct.variants || [];
            }

            if (updateData.variants.length > 0) {
                updateData.variants[0].inventoryQuantity = parseInt(body.stock);
                updateData.variants[0].price = body.price;
            } else {
                // If for some reason no variants exist, create one
                updateData.variants.push({
                    title: "Default Title",
                    price: body.price,
                    inventoryQuantity: parseInt(body.stock),
                    options: {}
                });
            }
        }

        // DEBUG LOGS
        const schemaPaths = Object.keys(Product.schema.paths);
        console.log("Active Schema Paths:", schemaPaths);
        console.log("Has stockLocation in schema?:", schemaPaths.includes("stockLocation"));
        console.log("Update Data:", JSON.stringify(updateData, null, 2));

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        console.log("Updated Product Result:", updatedProduct);

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        console.error("Product update error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update product" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        await dbConnect();

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Cleanup: Remove product from its category
        if (product.category) {
            await Category.findOneAndUpdate(
                { name: product.category },
                { $pull: { products: id } }
            );
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to delete product" },
            { status: 500 }
        );
    }
}
