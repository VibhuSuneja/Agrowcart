require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to your MongoDB (update the URI if needed)
const MONGODB_URI = process.env.MONGODB_URL || "mongodb://localhost:27017/snapcart";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ["user", "deliveryBoy", "admin", "farmer", "shg", "buyer", "startup", "processor"] 
    },
    image: { type: String },
    phone: { type: String },
    address: { type: String },
}, { timestamps: true });

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const User = mongoose.models.User || mongoose.model("User", userSchema);

        const password = await bcrypt.hash("123123", 10);

        const users = [
            { name: "Demo Farmer", email: "farmer@test.com", password, role: "farmer" },
            { name: "Demo Consumer", email: "consumer@test.com", password, role: "user" },
            { name: "Demo Corporate", email: "corporate@test.com", password, role: "buyer" },
            { name: "Demo SHG", email: "shg@test.com", password, role: "shg" },
            { name: "Demo Processor", email: "processor@test.com", password, role: "processor" },
            { name: "Demo Startup", email: "startup@test.com", password, role: "startup" },
            { name: "Demo Delivery", email: "delivery@test.com", password, role: "deliveryBoy" }
        ];

        for (const u of users) {
            const existing = await User.findOne({ email: u.email });
            if (!existing) {
                await User.create(u);
                console.log(`Created: ${u.role} -> ${u.email}`);
            } else {
                existing.password = password;
                existing.role = u.role; 
                await existing.save();
                console.log(`Updated Password & Role for: ${u.email}`);
            }
        }

        console.log("Seeding complete. Use password '123123' for all.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
