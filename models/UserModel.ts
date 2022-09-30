import mongoose = require("mongoose")

interface UserInterface{
    username: string,
    name: string,
    email: string,
    password: string,
    profilePic: string
}

const UserSchema = new mongoose.Schema<UserInterface>({
    username: {
        type:String,
        required:true,
        default:"",
    },
    name: {
        type:String,
        required:true,
        default:"",
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type:String,
        required: true,
        default: "https://www.mountsinai.on.ca/wellbeing/our-team/team-images/person-placeholder/image"
    }
})

export default mongoose.model<UserInterface>("user",UserSchema)