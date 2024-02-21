const COURT_SHEDULES=require('../Models/courtSheduleModels')
const Razorpay = require("razorpay");
const crypto=require('crypto')
const nodemailer = require('nodemailer');



const orders=async(req,res)=>{
   const slotData=await COURT_SHEDULES.findOne({_id:req.body.slotId})
   if (slotData?.bookedBy) {
    res.status(400).json({message:'slot already booked'})
    
   } else {
    try {
        const instance = new Razorpay({
            key_id: 'rzp_test_z93Zp9rqzCo9bC',
            key_secret: 'hQGdN6DL7ADcWjpWwRdyT6gR'
        });

        const options = {
            amount: slotData.cost*100, // amount in smallest currency unit
            currency: "INR",
            receipt: slotData._id, 
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
    
   }
    

}

const success=async(req,res)=>{
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            slotId
        } = req.body;
         
        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "hQGdN6DL7ADcWjpWwRdyT6gR");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`); 

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

              console.log(slotId,"slotid",req.userId);
      await COURT_SHEDULES.updateOne({_id:slotId},{$set:{bookedBy:req.userId},$push:{paymentOrders:{userId:req.userId,razorpayPaymentId,timeStamp:new Date()}}})
            intiateEmail(slotId,razorpayPaymentId)
        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }

}


const intiateEmail=async(id,razorpayPaymentId)=>{
    const slotData=await COURT_SHEDULES.findOne({_id:id}).populate('bookedBy').populate('courtId')
    const{date,slot,cost,bookedBy,courtId}=slotData
const transporter = nodemailer.createTransport({   
  service: "Gmail",
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "mycourt75@gmail.com",
    pass: "tkpb ambw kczt qzlq",
  },
});

  const info = await transporter.sendMail({
    from: "mycourt75@gmail.com", // sender address
    to: "hafee3155@gmail.com", // list of receivers
    subject: "Booking Confirmed ✔", // Subject line
    text: "thanks for book with us", // plain text body
    html: `<b>Hello ${bookedBy.fname+' '+bookedBy.lname}</b>
          <p>Your Booking at  ${courtId.courtName}  on  ${new Date(date) } at ${slot.name} has been confirmed with payment id ${razorpayPaymentId} </p> `, // html body
  });
 
  console.log("Message sent: %s", info.messageId);

}
// const deleteSlotData=async(req,res)=>{
//     try {
//         const slottid = req.params.slotId;

//         const booking = await COURT_SHEDULES.findByIdAndDelete(slottid);
//         if (!bookedBy) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }
//         res.json({ message: 'Booking deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// }

// }
 

 
    


module.exports={orders,success}