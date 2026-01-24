import mongoose from "mongoose";

export interface IMessage {
    _id?: mongoose.Types.ObjectId,
    roomId: string,
    text: string,
    senderId: mongoose.Types.ObjectId,
    time: string,
    createdAt?: Date,
    updatedAt?: Date
}

const messageSchema = new mongoose.Schema<IMessage>({
    roomId: {
        type: String,
        index: true
    },
    text: {
        type: String
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    time: String
}, { timestamps: true })

const Message = mongoose.models.NegotiationMessage || mongoose.model("NegotiationMessage", messageSchema)
export default Message as mongoose.Model<IMessage>