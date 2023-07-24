const axios = require("axios");
const Payment = require("../models/payment");
const { publicKey, secretKey } = require("../data/keys");

const controller = {};
let orderData = {};
let payment = {};

//Checkout view
controller.checkout = async (req, res) => {
  const payments = await Payment.find();
  res.render("checkout", { payments });
};

//Payment view
controller.payment = (req, res) => {
  orderData = req.body;
  res.render("payment", { orderData });
};

//Get token 
const getToken = async (data) => {
  const response = await axios.post(
    "https://secure.culqi.com/v2/tokens",
    data,
    {
      headers: {
        Authorization: `Bearer ${publicKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.id;
};

//Create a new charge
const createCharge = async (orderData, token, email) => {
  const response = await axios.post(
    "https://api.culqi.com/v2/charges",
    {
      amount: orderData.amount * 100,
      currency_code: orderData.currency,
      email: email,
      source_id: token,
    },
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//Format date
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
};

//Charge view
controller.charge = async (req, res) => {
  try {
    let token = await getToken(req.body);
    const email = req.body.email;
    payment = await createCharge(orderData, token, email);
    const date = formatDateTime(payment.creation_date);

    const paymentData = {
      id: payment.id,
      amount: orderData.amount,
      currency: orderData.currency,
      email,
      creationDate: date,
    };

    const newPayment = new Payment(paymentData);

    await newPayment.save();

    res.render("success", { payment, date });
  } catch (err) {
    console.error("Error al realizar la solicitud:", err);
    res.status(500).json({ err: "Ha ocurrido un error en la solicitud." });
  }
};

module.exports = controller;
