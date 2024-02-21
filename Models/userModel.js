const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        required:true,
        default:3
    }
    //user=3
    //vendor=2
    //admin=1
})

const users=mongoose.model('users',userSchema)
module.exports=users