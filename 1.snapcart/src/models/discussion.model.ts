import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: String,
    userImage: String,
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: String // User IDs
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const discussionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: String,
    userImage: String,
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: String // User IDs
    }],
    views: {
        type: Number,
        default: 0
    },
    comments: [commentSchema],
    isSolved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Discussion = mongoose.models.Discussion || mongoose.model("Discussion", discussionSchema);

export default Discussion;
