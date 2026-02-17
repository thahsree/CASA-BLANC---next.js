import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { folder: "casa-blanc-products", resource_type: "image" },
                    (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(result);
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error: any) {
        console.error("Upload Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Upload failed" },
            { status: 500 }
        );
    }
}
