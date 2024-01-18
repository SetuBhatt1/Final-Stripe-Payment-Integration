const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

const corsOptions = {
    origin: 'https://final-stripe-payment-integration.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials (e.g., cookies, authorization headers) cross-origin
    optionsSuccessStatus: 204, // Set the response status for successful preflight requests
  };
  
app.use(cors(corsOptions));
//app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
    const items = req.body.items;
    let lineItems = [];
    items.forEach((item) => {
        lineItems.push({
            price: item.id,
            quantity: item.quantity
        });
    });

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: "https://final-stripe-payment-integration.vercel.app/success",
            cancel_url: "https://final-stripe-payment-integration.vercel.app/cancel",
        });

        res.send(JSON.stringify({
            url: session.url
        }));
    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(process.env.PORT, () => console.log("Server listening on port"));