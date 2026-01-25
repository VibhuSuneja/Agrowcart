import mongoose from "mongoose";

interface IAIResponse {
    key: string;      // Unique key (e.g., "price-ragi-mandya")
    promptHash: string;
    response: string; // JSON stringified response
    expiry: Date;
}

const aiResponseSchema = new mongoose.Schema<IAIResponse>({
    key: { type: String, required: true, unique: true },
    promptHash: { type: String, required: true },
    response: { type: String, required: true },
    expiry: { type: Date, required: true }
}, { timestamps: true });

// Index for automatic deletion after expiry
aiResponseSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

const AIResponse = mongoose.models.AIResponse || mongoose.model("AIResponse", aiResponseSchema);

export default AIResponse;
