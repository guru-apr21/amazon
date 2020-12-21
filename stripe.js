const stripe = require("stripe")(
  "sk_test_51HhUbGDRaW3L2zxrOz9d8TOvQRpmQxM489GvgsN0IXlKJS4lN5LK4YUn3INZ2wWeQfwtwZAjKuT5sJHXnqJn5NDj00XE57kVEF"
);
const express = require("express");
const app = express();

const YOUR_DOMAIN = "http://localhost:3000/result";

app.post("/create-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Stubborn Attachments",
            images: ["https://i.imgur.com/EHyR2nP.png"],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });
  res.json(session);
});

app.listen(3000, () => console.log("Running on port 3000"));
