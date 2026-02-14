import mongoose from "mongoose";

export interface IOrder {
    _id?: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId
    items: [
        {
            product: mongoose.Types.ObjectId,
            name: string,
            price: string,
            unit: string,
            image: string
            quantity: number
        }
    ]
    ,
    isPaid: boolean
    totalAmount: number,
    paymentMethod: "cod" | "online"
    address: {
        fullName: string,
        mobile: string,
        city: string,
        state: string,
        pincode: string,
        fullAddress: string,
        latitude: number,
        longitude: number
    }
    assignment?: mongoose.Types.ObjectId
    assignedDeliveryBoy?: mongoose.Types.ObjectId
    status: "pending" | "confirmed" | "out of delivery" | "delivered" | "cancelled" | "refunded",
    cancelledAt?: Date
    refundedAt?: Date
    cancellationReason?: string
    createdAt?: Date
    updatedAt?: Date
    deliveryOtp: string | null
    deliveryOtpVerification: Boolean
    deliveredAt: Date
    batchNumber: string
}

const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: String,
            price: String,
            unit: String,
            image: String,
            quantity: Number
        }
    ],
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        default: "cod"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    totalAmount: Number,
    address: {
        fullName: String,
        mobile: String,
        city: String,
        state: String,
        pincode: String,
        fullAddress: String,
        latitude: Number,
        longitude: Number
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryAssignment",
        default: null
    },

    assignedDeliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "out of delivery", "delivered", "cancelled", "refunded"],
        default: "pending"
    },
    cancelledAt: {
        type: Date
    },
    refundedAt: {
        type: Date
    },
    cancellationReason: {
        type: String
    },
    deliveryOtp: {
        type: String,
        default: null
    },
    deliveryOtpVerification: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    batchNumber: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true })

orderSchema.pre("save", async function (next) {
    if (!this.batchNumber) {
        const random = Math.floor(100000 + Math.random() * 900000);
        this.batchNumber = `BATCH-${random}`;
    }
    next();
});

// FUTURE-READY INDEXES (For high-traffic performance)
orderSchema.index({ user: 1 });
orderSchema.index({ assignedDeliveryBoy: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });


const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)
export default Order