import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // Optional, in case we allow anonymous or just captured names
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Community Member"
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    content: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: "India"
    },
    email: {
        type: String,
        required: false
    }
}, { timestamps: true })

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema)

export default Review
