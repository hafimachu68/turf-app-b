const { json } = require("express");
const court = require("../Models/courtModels");
const COURT_SHEDULES=require('../Models/courtSheduleModels')



const addCourtData= async(req,res)=>{
    try {
        
  await  court({
        courtName:req.query.courtName,
        location:req.query.location,
        address:req.query.address,
        type:req.query.type,
        about:req.query.about,
        description:req.query.description,
        courtPic:req.file.filename}).save()
       res.status(200).json({message:"court data added sucessfully"})
        
    } catch (error) {
        res.status(500).json({message:"invalid entry"})
    }
  
};


const addTimeSlotData=(req,res)=>{

    try {
 const {startDate,endDate,cost,selectedTiminigs,courtId}=req.body
   let currentDate= new Date(startDate)
   const lastDate=new Date(endDate)
   const slotObject=[]
  while(currentDate<=lastDate){
    for(let data of selectedTiminigs){
        slotObject.push({
            date:JSON.parse(JSON.stringify(currentDate)),
            slot:{
                name:data.name,
                id:data.id
            },
            cost,
            courtId
        })
    }
    currentDate.setDate(currentDate.getDate()+1)
  }
  COURT_SHEDULES.insertMany(slotObject).then((response)=>{
    res.status(200).json({ message: "Slots generated successfully" });
})
        
    } catch (error) {
        console.log(err)
        
    }
   
  
}
const updateCourtData = async (req, res) => {
    try {
        const courtId = req.params.courtId;
        const { courtName, location, address, type, about, description } = req.body;

        // Check if image is uploaded
        let courtPic;
        if (req.file) {
            courtPic = req.file.filename;
        }

        const updatedCourtData = {
            courtName,
            location,
            address,
            type,
            about,
            description
        };

        // If image is uploaded, add it to updatedCourtData
        if (courtPic) {
            updatedCourtData.courtPic = courtPic;
        }

        // Find the court by ID and update its data
        const updatedCourt = await court.findByIdAndUpdate(courtId, updatedCourtData, { new: true });

        res.status(200).json({ message: "Court data updated successfully", updatedCourt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const deleteCourtData = async (req, res) => {
    try {
        const courtId = req.params.courtId;

        // Find the court by ID and delete it
        const deletedCourt = await court.findByIdAndDelete(courtId);

        // Also delete associated schedules
        await COURT_SHEDULES.deleteMany({ courtId });

        if (!deletedCourt) {
            return res.status(404).json({ message: 'Court not found' });
        }

        res.status(200).json({ message: 'Court deleted successfully', deletedCourt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports={addCourtData,addTimeSlotData,updateCourtData,deleteCourtData}