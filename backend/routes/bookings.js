const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

router.post('/', async (req, res) => {
    const { vehicle, customer, startDate, endDate } = req.body;
    try {
        const overlap = await Booking.isOverlapping(vehicle, new Date(startDate), new Date(endDate));
        if (overlap) {
            return res.status(400).send({ error: "Booking dates overlap for this vehicle" });
        }
        const booking = new Booking({ vehicle, customer, startDate, endDate });
        await booking.save();
        res.status(201).send(booking);
    } catch (error) {
        res.status(500).send({ error: "Failed to create booking" });
    }
});

router.get('/', async (req, res) => {
    const bookings = await Booking.find().populate('vehicle').populate('customer');
    res.send(bookings);
});

router.delete('/:bookingId', async (req, res) => {
    const { bookingId } = req.params;
    try {
        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            console.log("wtffffffffffffffffffff")
            return res.status(404).send({ error: "Booking not found" });
        }

        // Check if the booking is cancelable (2 days before start date)
        const currentDate = new Date();
        const twoDaysBeforeStart = new Date(booking.startDate);
        twoDaysBeforeStart.setDate(twoDaysBeforeStart.getDate() - 2);

        if (currentDate > twoDaysBeforeStart) {
            return res.status(400).send({ error: "Booking can only be cancelled 2 days before the start date" });
        }

        // Delete the booking if eligible
        await Booking.findByIdAndDelete(bookingId);
        res.status(200).send({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).send({ error: "Failed to cancel booking" });
    }
});

module.exports = router;
