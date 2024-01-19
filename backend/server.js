const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(
  cors({
    origin: "https://final-stripe-payment-integration.vercel.app", // Allow only this origin
    methods: "GET,POST,OPTIONS", // Allow only these methods
  })
);
app.use(express.json());

exports.handler = async (req, res) => {
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity,
    });
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success", // Your original success URL
      cancel_url: "http://localhost:3000/cancel", // Your original cancel URL
    });

    res.send(
      JSON.stringify({
        url: session.url,
      })
    );
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
};
