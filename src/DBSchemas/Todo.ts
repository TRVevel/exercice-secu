import mongoose, { Schema } from "mongoose"

export interface TodoI {
    task: string,
    completed: boolean,
    addedAt: Date,
    userId: string
}

const todoSchema = new Schema<TodoI>({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
})

export default mongoose.model<TodoI>('Todo', todoSchema);