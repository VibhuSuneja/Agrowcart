import mongoose from "mongoose";

export interface IRecipe {
    _id?: mongoose.Types.ObjectId;
    title: string; // e.g., "Ragi Dosa"
    description: string;
    image: string;
    chef: string; // Name of user/chef
    chefId?: mongoose.Types.ObjectId;
    timeToCook: string; // e.g., "30 mins"
    difficulty: "Easy" | "Medium" | "Hard";
    ingredients: string[];
    instructions: string[];
    likes: number;
    tags: string[]; // e.g., ["Breakfast", "Gluten-Free"]
    createdAt?: Date;
}

const recipeSchema = new mongoose.Schema<IRecipe>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    chef: { type: String, required: true },
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timeToCook: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    ingredients: [{ type: String }],
    instructions: [{ type: String }],
    likes: { type: Number, default: 0 },
    tags: [{ type: String }]
}, { timestamps: true });

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
export default Recipe;
