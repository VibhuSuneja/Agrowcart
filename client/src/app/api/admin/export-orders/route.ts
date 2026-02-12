import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email')

        // Create CSV header
        const headers = ["Order ID", "Customer", "Email", "Amount", "Status", "Payment", "Date"]
        const csvRows = [headers.join(",")]

        // Add data rows
        orders.forEach(order => {
            const row = [
                order._id,
                order.user?.name || "Guest",
                order.user?.email || "N/A",
                `"₹${order.totalAmount}"`,
                order.status,
                order.paymentMethod,
                new Date(order.createdAt).toLocaleDateString()
            ]
            csvRows.push(row.join(","))
        })

        const csvContent = csvRows.join("\n")

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": "attachment; filename=agrowcart_orders_export.csv",
            },
        })
    } catch (error) {
        return NextResponse.json({ message: `Export error ${error}` }, { status: 500 })
    }
}
