
import connectDb from "@/lib/db";
import Address from "@/models/address.model";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ addressId: string }> }) {
    try {
        const { addressId } = await params;
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

        const updatedAddress = await Address.findOneAndUpdate(
            { _id: addressId, user: session.user.id },
            {
                fullName,
                mobile,
                city,
                state,
                pincode,
                fullAddress,
                latitude,
                longitude,
                isDefault
            },
            { new: true }
        );

        if (!updatedAddress) {
            return NextResponse.json({ message: "Address not found", success: false }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Address updated successfully", address: updatedAddress });
    } catch (error) {
        return NextResponse.json({ message: "Error updating address", error, success: false }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ addressId: string }> }) {
    try {
        const { addressId } = await params;
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        await connectDb();
        const deletedAddress = await Address.findOneAndDelete({ _id: addressId, user: session.user.id });

        if (!deletedAddress) {
            return NextResponse.json({ message: "Address not found", success: false }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting address", error, success: false }, { status: 500 });
    }
}
