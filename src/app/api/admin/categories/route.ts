import { authOptions } from "@/lib/auth"; // Verify this path
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const categories = await Category.find().sort({ name: 1 });
        return NextResponse.json(categories);
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Category name is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check for duplicates (case-insensitive)
        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") }
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: "Category already exists" },
                { status: 400 }
            );
        }

        const category = await Category.create({ name, description });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        console.error("Error creating category:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Category already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
