const express = require('express');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const router = express.Router();

router.post('/', async (req, res) => {
    const { vehicleNo, name, type, rentalRate } = req.body;
    try {
        const existingVehicle = await Vehicle.findOne({ vehicleNo });
        if (existingVehicle) {
            return res.status(400).send({ error: "Vehicle number already exists" });
        }
        const vehicle = new Vehicle({ vehicleNo, name, type, rentalRate });
        await vehicle.save();
        res.status(201).send(vehicle);
    } catch (error) {
        res.status(500).send({ error: "Failed to add vehicle" });
    }
});

router.get('/', async (req, res) => {
    const vehicles = await Vehicle.find();
    res.send(vehicles);
});

// router.delete('/:vehicleId', async (req, res) => {
//     const { vehicleId } = req.params;
//     try {
//         // Find future bookings for this vehicle
//         const futureBooking = await Booking.findOne({
//             vehicle: vehicleId,
//             startDate: { $gt: new Date() }
//         });

//         if (futureBooking) {
//             return res.status(400).send({ error: "Vehicle cannot be deleted as it has future bookings" });
//         }

//         // Delete the vehicle as it has no future bookings
//         await Vehicle.findByIdAndDelete(vehicleId);
//         res.status(200).send({ message: "Vehicle deleted successfully" });
//     } catch (error) {
//         res.status(500).send({ error: "Failed to delete vehicle" });
//     }
// });

module.exports = router;
