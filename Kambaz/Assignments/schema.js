import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        _id: String,
        title: String,
        description: String,
        due: Date,
        course: String,
        points: Number,
        available: Date,
    }, { collection: "assignments" }
);
export default assignmentSchema;