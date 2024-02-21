const USERS=require('../Models/userModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt=require('jsonwebtoken')

const doSignUp= async(req,res)=>{

    try {
        const users= await USERS.findOne({email:req.body.email})
    if(users){
        res.status(200).json({message:"email already exist"})
        return    

    }

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {

        USERS({
            fname:req.body.fName,
            lname:req.body.lName,
            email:req.body.email,
            password: hash
        }).save().then((response)=>{
            res.status(200).json({message:"signup data successfull"})    
        })
        
    });

    } catch (error) {
        
    }
   

}

const doLogin=async(req,res)=>{
try {
    const user=await USERS.findOne({email:req.body.email})
if(user){
    bcrypt.compare(req.body.password,user.password,(err,hashRes)=>{
if (hashRes) {
    const token=jwt.sign({userid:user._id,email:user.email,fname:user.fname,lname:user.lname,role:user?.role},"mycourt",{expiresIn:'2d'})
    user.password=undefined
    res.status(200).json({message:"login sucessfull",token:token,user:user })
}
    })
}else{
    res.status(200).json({message:"invalid credentials",token:null})
}

} catch (error) {
    
}
   
 
}







module.exports={doSignUp,doLogin} 
