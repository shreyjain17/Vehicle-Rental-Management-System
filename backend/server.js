const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const vehiclesRoutes = require('./routes/vehicles');
const customersRoutes = require('./routes/customers');
const bookingsRoutes = require('./routes/bookings');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static('public'));
app.use(express.static('../frontend'));

mongoose.connect('mongodb+srv://shreyvj007:vrms@vrms.gmnd7.mongodb.net/vrms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/bookings', bookingsRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
