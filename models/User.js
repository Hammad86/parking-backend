import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    vehicleNumber: {
        type: String,
        required: true,
        unique: true,
    },
    cnicNumber: {
        type: String,
        required: true,
        unique: true,
    },
    pickerValue: {
        type: String,
        required: true,
    },
    park: {
        type: String,
        required: true,
    },
    uri:{
        type: String,
        required: true
    }
    
    
});


const User = new mongoose.model("User", userSchema)


export default User;



