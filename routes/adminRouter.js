var express = require('express');
const { addCourtData, addTimeSlotData,updateCourtData ,deleteCourtData} = require('../controllers/adminController');
const multer = require('multer');
const { adminAuth } = require('../midlware/authorization');
var router = express.Router();

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/courts')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname)
    }
})
const upload=multer({storage:fileStorage})

router.post('/addCourtData',adminAuth,upload.single('image'),addCourtData);
router.post('/addTimeSlotData',adminAuth,addTimeSlotData)
// Update Court Data Route
router.put('/updateCourtData/:courtId', adminAuth, upload.single('image'), updateCourtData);
router.delete('/deleteData/:courtId', adminAuth, deleteCourtData);


 
   
module.exports=router;    