
import connectDb from "@/lib/db";
import Address from "@/models/address.model";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        await connectDb();
        const addresses = await Address.find({ user: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, addresses });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching addresses", error, success: false }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const body = await req.json();
        const { fullName, mobile, city, state, pincode, fullAddress, latitude, longitude, isDefault } = body;

        await connectDb();

        if (isDefault) {
            await Address.updateMany({ user: session.user.id }, { isDefault: false });
        }

        const newAddress = await Address.create({
            user: session.user.id,
            fullName,
            mobile,
            city,
            state,
            pincode,
            fullAddress,
            latitude,
            longitude,
            isDefault: isDefault || false
        });

        return NextResponse.json({ success: true, message: "Address saved successfully", address: newAddress }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error saving address", error, success: false }, { status: 500 });
    }
}
