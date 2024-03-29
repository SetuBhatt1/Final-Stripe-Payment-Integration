const express = require('express');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://final-stripe-payment-integration.vercel.app');
    next();
});

app.use(cors({
    origin: '*',
    methods: 'GET,POST',
}));

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