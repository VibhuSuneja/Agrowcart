import mongoose from "mongoose";

export interface IProductReview {
    _id?: string;
    product: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    userName: string;
    rating: number;
    comment: string;
    verified: boolean; // Whether the user purchased this product
    helpful: number; // How many users found this helpful
    createdAt?: Date;
    updatedAt?: Date;
}

const productReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false // Set to true if user bought this product
    },
    helpful: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Index for efficient queries
productReviewSchema.index({ product: 1, createdAt: -1 });
productReviewSchema.index({ user: 1, product: 1 }, { unique: true }); // One review per user per product

const ProductReview = mongoose.models.ProductReview || mongoose.model("ProductReview", productReviewSchema);

export default ProductReview;
