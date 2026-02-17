import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const orders = await Order.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ orders });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId, status } = await req.json();

        if (!orderId || !status) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await dbConnect();
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        return NextResponse.json({ order });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update order" },
            { status: 500 }
        );
    }
}
