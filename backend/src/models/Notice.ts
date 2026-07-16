    import mongoose from "mongoose";

    const noticeSchema = new mongoose.Schema(
    {
        title: {
        type: String,
        trim: true,    
        required: [true, "Title is required"],
        },
        content: {
        type:String,
        trim: true,
        required: [true, "Content is required"],
        },
        postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Posted By is required"],
        },

    },
    { timestamps: true }
    );

    export default mongoose.model("Notice", noticeSchema);