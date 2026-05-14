import mongoose, { Schema } from "mongoose";


const sessionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // creates a TTL index which deletes the document after the time give in 'expires' field.
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 60
    }
});

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
