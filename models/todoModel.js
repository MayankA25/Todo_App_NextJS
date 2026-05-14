import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// To avoid multiple compilation error for model.

// As it will run everytime the "Todo" model is used. So to avoid that we will use the existing Todo model if that doesnt exists then a new one will be created.
export const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema)