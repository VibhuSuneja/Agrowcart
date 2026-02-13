import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

        const url = await uploadOnCloudinary(file);

        if (!url) return NextResponse.json({ message: "Upload failed" }, { status: 500 });

        return NextResponse.json({ url }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
