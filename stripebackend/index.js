const express = require("express")
const cors = require("cors");
const stripe = require("stripe")("sk_test_51Hp8swCIaZnxCRUH7xN5nB5b1yCR4epngHj2BZHqQrH7b1EDWdNxiAL25QbDXKOpmpI2aL4r4WvG4XFARPauwSJU00EYtgNhip")
const { v4: uuidv4 } = require('uuid');
const app = express();

//middleware
app.use(express.json())
app.use(cors())


//routes
app.get("/", (req, res) => {
    res.send("It Works Fine")
})

app.post("/payment", (req, res) => {
    const { product, token } = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE", product.price);
    const idempontencyKey = uuidv4();
    return stripe.customers
        .create({
            email: token.email,
            source: token.id
        })
        .then(customer => {
            stripe.charges.create(
                {
                    amount: product.price * 100,
                    currency: "usd",
                    customer: customer.id,
                    receipt_email: token.email,
                    description: `purchase of ${product.name}`,
                    shipping: {
                        name: token.card.name,
                        address: {
                            country: token.card.address_country
                        }
                    }
                },
                { idempontencyKey }
            );
        })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err));
});

//listen
const PORT = 8000;
app.listen(PORT, () => console.log("connect", PORT))