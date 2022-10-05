import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postedBy: {
        type: Object,
        required:true,
        childSchemas: {
            _id: {
                type: mongoose.Types.ObjectId
            },
            name: {
                type: String
            },
            email: {
                type: String
            },
            password: {
                type: String
            },
            username: {
                type: String
            },
            profilePic: {
                type: String
            },
            __v: {
                type: Number
            }
        }
    },
        totalComments: {
            type: Number,
            default: 0
        },
        comments: {
            type: Array,
            default: []
        },
        totalLikes: {
            type: Number,
            default: 0
        },
        likes: {
            type: Array,
            default: []
        },
        postTime: {
            type: String,
            required: true
        }
    })

export default mongoose.model("post", PostSchema)