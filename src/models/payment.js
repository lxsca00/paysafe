const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  id: String,
  amount: Number,
  currency: String,
  email: String,
  creationDate: String,
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
