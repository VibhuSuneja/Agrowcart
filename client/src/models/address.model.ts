
import mongoose from "mongoose";

export interface IAddress {
    user: mongoose.Types.ObjectId;
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
}

const addressSchema = new mongoose.Schema<IAddress>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    fullAddress: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

addressSchema.index({ user: 1 });

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);
export default Address;
