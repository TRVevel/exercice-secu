import mongoose, { Document, Schema } from "mongoose"

export interface UserI extends Document {
    name: string,
    email: string,
    hashedPassword: string,
    age: number,
    addedAt: Date
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    age: { type: Number },
    addedAt: { type: Date, default: Date.now }
})

export default mongoose.model<UserI>('User', UserSchema);
