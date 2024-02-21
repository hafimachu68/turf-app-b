var express = require('express');
const { getAllcourtsData, getSingleCourtData,dayWiseTimeSlot, getMybookingsData} = require('../controllers/usersController');
const { userAuth } = require('../midlware/authorization');
var router = express.Router();

/* GET users listing. */
router.get('/getAllcourtsData',userAuth,getAllcourtsData)
router.get('/getSingleCourtData',userAuth,getSingleCourtData)
router.get('/dayWiseTimeSlot',userAuth,dayWiseTimeSlot)
router.get('/getMybookingsData',userAuth,getMybookingsData)


// router.get('getLatestUpdatedData',userAuth,getlatestUpdetedData)



module.exports = router;
 