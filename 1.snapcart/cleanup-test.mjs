import mongoose from 'mongoose';

const MONGODB_URL = "mongodb+srv://myrogstrixg17_db_user:pGcewX31LC7etXFV@cluster0.t72q7ps.mongodb.net/";

async function cleanup() {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB");
        const res = await mongoose.connection.collection('users').deleteMany({
            $or: [
                { email: { $regex: /_test@example.com$/ } },
                { email: { $regex: /^shg_\d+@example\.com$/ } },
                { email: { $regex: /^proc_\d+@example\.com$/ } }
            ]
        });
        console.log(`Deleted ${res.deletedCount} test users.`);
        await mongoose.disconnect();
    } catch (err) {
        console.error("Cleanup failed:", err);
    }
}

cleanup();
