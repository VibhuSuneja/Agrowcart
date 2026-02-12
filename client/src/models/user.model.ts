import mongoose from "mongoose";

// Passkey credential structure for WebAuthn
export interface IPasskeyCredential {
    credentialID: string; // Base64URL encoded
    credentialPublicKey: string; // Base64URL encoded
    counter: number;
    transports?: string[];
    createdAt: Date;
}

export interface IUser {
    _id?: mongoose.Types.ObjectId
    name: string
    email: string
    password?: string
    mobile?: string
    role: "user" | "deliveryBoy" | "admin" | "farmer" | "shg" | "buyer" | "startup" | "processor"
    image?: string,
    location?: {
        type: string;
        coordinates: number[];
    },
    socketId: string | null
    isOnline: Boolean
    status?: "online" | "away" | "dnd"
    bio?: string
    wishlist?: mongoose.Types.ObjectId[]
    agreedToTerms?: Date
    passkeys?: IPasskeyCredential[]
    passkeyChallenge?: string
    resetToken?: string
    resetTokenExpiry?: Date
    isBanned?: boolean
    isVerified?: boolean
}

const passkeyCredentialSchema = new mongoose.Schema({
    credentialID: { type: String, required: true },
    credentialPublicKey: { type: String, required: true },
    counter: { type: Number, required: true, default: 0 },
    transports: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
}, { _id: false })

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ["user", "deliveryBoy", "admin", "farmer", "shg", "buyer", "startup", "processor"],
        default: "user"
    },
    image: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    socketId: {
        type: String,
        default: null
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["online", "away", "dnd"],
        default: "online"
    },
    bio: {
        type: String,
        default: ""
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    agreedToTerms: {
        type: Date
    },
    passkeys: {
        type: [passkeyCredentialSchema],
        default: []
    },
    passkeyChallenge: {
        type: String
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry: {
        type: Date
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

userSchema.index({ mobile: 1 });
userSchema.index({ role: 1 });
userSchema.index({ location: "2dsphere" })

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
