const mongoose=require('mongoose')

const courtSchema=mongoose.Schema({
    courtName: {
        type:String,
        required:true
    },
    location:  {
        type:String,
        required:true
    },
    type:  {
        type:String,
        required:true
    },

    about:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    address:  {
        type:String,
        required:true
    },
    courtPic:{
        type:String,
        required:true
    }
    ,
    timeStamp:{
        type:Date,
        default:new Date()
    }
})
const court=mongoose.model('court',courtSchema)
module.exports=court