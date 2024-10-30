const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleNo: { type: String, unique: true, required: true },
    name: String,
    type: String,
    rentalRate: Number
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
