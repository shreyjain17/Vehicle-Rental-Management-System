const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String,
    email: String,
    phone: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('Customer', customerSchema);
