import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, secretKey } = await req.json();

        // Simple protection for admin creation
        if (secretKey !== process.env.ADMIN_CREATION_SECRET) {
            return NextResponse.json(
                { error: "Forbidden: Invalid secret key" },
                { status: 403 }
            );
        }

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            provider: "credentials",
        });

        return NextResponse.json(
            { message: "Admin created successfully", user: { email: newUser.email } },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
