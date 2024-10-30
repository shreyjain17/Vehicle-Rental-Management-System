const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, auto: true },  // Auto-generated ID
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    startDate: Date,
    endDate: Date,
    totalCost: Number
});

// Middleware to calculate total cost before saving
bookingSchema.pre('save', async function (next) {
    const vehicle = await mongoose.model('Vehicle').findById(this.vehicle);
    const days = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
    this.totalCost = days * vehicle.rentalRate;
    next();
});

// Static method to check for overlapping bookings for a vehicle
bookingSchema.statics.isOverlapping = async function (vehicle, startDate, endDate) {
    return await this.exists({
        vehicle,
        $or: [
            { startDate: { $lte: endDate, $gte: startDate } },
            { endDate: { $gte: startDate, $lte: endDate } },
            { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
        ]
    });
};

module.exports = mongoose.model('Booking', bookingSchema);
