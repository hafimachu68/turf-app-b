const courts=require('../Models/courtModels')
const COURT_SHEDULES = require("../Models/courtSheduleModels");
const ObjectId=require('mongoose').Types.ObjectId



const getAllcourtsData = (req, res) => {
    courts.find().then((response) => {
        res.status(200).json(response)
    })
        .catch(err => {
            res.status(500).json(err)
        })
};

// const getlatestUpdetedData=(req,res)=>{
//     try {
//         COURT_SHEDULE.find({courtId:req.query.courtId})
//         .sort({date:-1})
//         .limit(1)
//         .select("date"
//         .then((response)=>{
//             let latestDate=new Date(response[0]?.date);
//             res.status(200).json({minDate:latestDate})

//         })
//         )
//     } catch (error) {
//         res.status(500).json(error);

//     }

// }



const getSingleCourtData = async (req, res) => {
    try {
        const result = await courts.findOne({ _id: req.query.courtId })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


};
const dayWiseTimeSlot=(req,res)=>{
    let currentHour=new Date(req.query.date).getHours()
    
    let currentDate=new Date(new Date(req.query.date).setUTCHours(0,0,0,0))
    COURT_SHEDULES.aggregate([{
       $match:{courtId:new ObjectId(req.query.courtId),
        date:currentDate,
        'slot.id':{$gt:currentHour+1}
    }
    },
    {
        $lookup:{
            from:'courts',
            localField:'courtId',
            foreignField:'_id',
            as:'court'    
     },
    },
        {$project:{
        court:{$arrayElemAt:['$court',0]},
        _id:1,
        date:1,
        slot:1,
        cost:1,
        bookedBy:1

    },
},
]).then((response)=>{
        res.status(200).json(response)
    }).catch((err)=>{
        console.log(err);
        res.status(500).json("no response")

    })

}

const getMybookingsData=(req,res)=>{

    const currentDate=new Date()
    const slotHour=currentDate.getHours()
    currentDate.setUTCHours(0,0,0,0);

    COURT_SHEDULES.aggregate([
        {
            $match: {
                bookedBy: new ObjectId(req.userId),
              $expr:{
                $or:[
                    {$gt:['$date',currentDate]},
                    {$and:[
                        {$eq:['$date',currentDate]},
                        {$gte:['$slot.id',slotHour]}
                    ]

                    },
                ],
              },   
            },
         },
         {
             $lookup:{
                from:'courts',
                localField:'courtId',
                foreignField:'_id',
                as:'courts'

             }
         },{
            $project:{
                _id:1,
                date:1,
                slot:1,
                courtData:{$arrayElemAt:['$courts',0]}
            }
         }

    ]).then((response)=>{
        console.log(response);
        res.status(200).json(response)
    })




}



module.exports = { getAllcourtsData, getSingleCourtData,dayWiseTimeSlot,getMybookingsData }