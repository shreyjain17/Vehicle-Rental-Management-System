const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const existingCustomer = await Customer.findOne({ phone });
        if (existingCustomer) {
            return res.status(400).send({ error: "Phone number already exists" });
        }
        const customer = new Customer({ name, email, phone });
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        res.status(500).send({ error: "Failed to add customer" });
    }
});

router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

module.exports = router;
