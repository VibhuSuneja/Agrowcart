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
    createdAt?: Date,
    updatedAt?: Date,
    owner?: mongoose.Types.ObjectId
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
    }
}, {
    timestamps: true
})


const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
export default Product

