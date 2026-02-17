import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { secretKey } = await req.json();

        if (secretKey !== process.env.ADMIN_CREATION_SECRET) {
            return NextResponse.json(
                { error: "Invalid secret key" },
                { status: 403 }
            );
        }

        await dbConnect();

        // Update current user to admin
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { role: "admin" },
            { new: true }
        );

        return NextResponse.json(
            { message: "Promoted to admin successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
