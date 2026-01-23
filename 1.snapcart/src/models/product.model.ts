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
    updatedAt?: Date
}

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            "Millets", "Pulses", "Value-Added", "Seeds", "Fertilizers",
            "Raw Millets",
            "Millet Rice",
            "Millet Flour",
            "Millet Snacks",
            "Value-Added Products",
            "Other"
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
    }
}, {
    timestamps: true
})


const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
export default Product

