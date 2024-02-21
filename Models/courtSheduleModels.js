const mongoose=require('mongoose')

const courtSheduleSchema= mongoose.Schema({
    date:{
        type:Date,
        required:true,
    },
    slot:{
        type:Object,
        required:true,
    },
    cost:{
        type:Number,
        required:true,
    },
    bookedBy:{
        type:mongoose.Types.ObjectId,
        ref:'users'
    },
    cancellation:{
        type:Array,  //userID payment
    },
     courtId:{
        type:mongoose.Types.ObjectId,
       ref:'court'
    },
    paymentOrders:{
        type:Array,
        
    }
})


const courtShedule=mongoose.model('courtShedule',courtSheduleSchema)
module.exports = courtShedule;