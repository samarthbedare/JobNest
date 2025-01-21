import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    auth0Id: {
        type: String,
        required: true,
        unique: true,
    },
    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
    ],

    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
    ],

    role: {
        type: String,
        enum:["jobseeker","recruiter"],
        default:"jobseeker",
    },

    resume: {
        type: String,
    },

    profilePic: {
        type: String,
    },

    bio: {
        type: String,
        default: "No bio provided",
    },
    profession:{
        type: String,
        default: "Unemployed",
    },
     
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;