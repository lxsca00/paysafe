const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController")

router.get("/", paymentController.checkout)
router.post("/payment", paymentController.payment)
router.post("/charge", paymentController.charge)


module.exports = router;