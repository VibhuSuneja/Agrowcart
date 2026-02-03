import mongoose from "mongoose";

export interface IProduct {
    _id?: mongoose.Types.ObjectId,
    name: string,
    category: string,
    price: string,
    unit: string,
    image: string,
    priceAI?: string,
    farmId?: string,
    harvestDate?: Date,
    qualityCertification?: string,
    rating?: number,
    reviewCount?: number,
    scientificBenefits?: string,
    createdAt?: Date,
    updatedAt?: Date,
    owner?: mongoose.Types.ObjectId,
    // Stock Management
    stock?: number, // null/undefined = in stock, 0 = out of stock
    // Legal & Compliance Fields
    fssaiLicense?: string,
    batchNumber?: string,
    isCompliant?: boolean,
    disclaimer?: string,
    originState?: string,
    originCity?: string,
}

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            "Raw Millets",
            "Millet Rice",
            "Millet Flour",
            "Millet Snacks",
            "Value-Added",
            "Seeds",
            "Organic Mix"
        ],
        required: true
    },
    price: {
        type: String,
        required: true

    }
    ,
    unit: {
        type: String,
        required: true,
        enum: [
            "kg", "g", "liter", "ml", "piece", "pack", "quintal"
        ]

    }
    ,
    image: {
        type: String,
        required: true

    },
    priceAI: {
        type: String
    },
    farmId: {
        type: String
    },
    harvestDate: {
        type: Date
    },
    qualityCertification: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    scientificBenefits: {
        type: String,
        default: "Cultivated for millennia, this millet is power-packed with essential minerals and fiber, promoting digestive health and sustained energy release."
    },
    // Legal & Compliance Schema Addition
    fssaiLicense: {
        type: String,
        required: false // Optional for raw farmers, mandatory for processors
    },
    batchNumber: {
        type: String,
        required: false
    },
    isCompliant: {
        type: Boolean,
        default: false // Requires admin/system approval
    },
    disclaimer: {
        type: String,
        default: "Product information is provided by the seller. AgrowCart is a marketplace and not responsible for seller claims."
    },
    originState: {
        type: String,
        default: "Haryana"
    },
    originCity: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: null // null = unlimited/in stock
    }
}, {
    timestamps: true
})


const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
export default Product

