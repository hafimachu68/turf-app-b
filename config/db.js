const mongoose=require('mongoose')
const connectDb= async()=>{

     try { 
        const connection=await mongoose.connect('mongodb://127.0.0.1:27017/my-court',{
            useNewUrlParser:'true'
        })
        console.log("Mongodb connected");
        
     } catch (error) {
        console.log("not connected");
        
     }
}
module.exports=connectDb