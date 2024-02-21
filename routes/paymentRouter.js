var express = require('express');
const { userAuth } = require('../midlware/authorization');
const {orders,success}=require('../controllers/paymentController')
var router = express.Router();

router.post('/orders',userAuth,orders)
router.post('/success',userAuth,success)
// router.delete('/deleteSlot/:slotId', userAuth, deleteSlotData);




  






module.exports = router;
