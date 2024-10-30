class VRMS {
    constructor() {
        this.vehicles = [];
        this.customers = [];
        this.bookings = [];
        this.init();  // Initialize data fetching on page load
    }

    // Initialize the app by fetching data
    async init() {
        await this.fetchVehicles();
        await this.fetchCustomers();
        await this.fetchBookings();
    }

    async fetchVehicles() {
        try {
            const response = await fetch('http://localhost:3000/api/vehicles');
            this.vehicles = await response.json();
            this.updateVehicleList();
            this.populateVehicleDropdown();  // Populate dropdown in bookings.html
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
        }
    }

    async fetchCustomers() {
        try {
            const response = await fetch('http://localhost:3000/api/customers');
            this.customers = await response.json();
            this.updateCustomerList();
            this.populateCustomerDropdown();  // Populate dropdown in bookings.html
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        }
    }

    async fetchBookings() {
        try {
            const response = await fetch('http://localhost:3000/api/bookings');
            this.bookings = await response.json();
            this.updateBookingList();
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        }
    }

    // Update the vehicle list on vehicles.html
    updateVehicleList() {
        const vehicleList = document.getElementById("vehicleList");
        if (vehicleList) {
            vehicleList.innerHTML = "";
            this.vehicles.forEach(vehicle => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div class="item-header">${vehicle.name}</div>
                    <div class="item-detail">Vehicle No.: ${vehicle.vehicleNo}</div>
                    <div class="item-detail">Type: ${vehicle.type}</div>
                    <div class="item-detail">Rental Rate: Rs. ${vehicle.rentalRate}/day</div>
                `;
                vehicleList.appendChild(li);
            });
        }
    }

    // Update the customer list on customers.html
    updateCustomerList() {
        const customerList = document.getElementById("customerList");
        if (customerList) {
            customerList.innerHTML = "";
            this.customers.forEach(customer => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div class="item-header">${customer.name}</div>
                    <div class="item-detail">Customer ID: ${customer.customerId}</div>
                    <div class="item-detail">Phone: ${customer.phone}</div>
                    <div class="item-detail">Email: ${customer.email}</div>
                `;
                customerList.appendChild(li);
            });
        }
    }

    // Update the booking list to show total cost and days
    updateBookingList() {
        const bookingList = document.getElementById("bookingList");
        if (bookingList) {
            bookingList.innerHTML = "";
            this.bookings.forEach(booking => {
                const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                <div class="item-header">${booking.customer.name} booked ${booking.vehicle.name}</div>
                <div class="item-detail">Booking ID: ${booking.bookingId}</div>
                <div class="item-detail">From: ${this.formatDate(booking.startDate)}</div>
                <div class="item-detail">To: ${this.formatDate(booking.endDate)}</div>
                <div class="item-detail">Days: ${days}</div>
                <div class="item-detail">Total Cost: Rs. ${booking.totalCost}</div>
                <button class="btn btn-warning btn-sm" onclick="cancelBooking('${booking._id}')">Cancel Booking</button>
            `;
                bookingList.appendChild(li);
            });
        }
    }


    // Format date to YYYY-MM-DD
    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Populate vehicle dropdown to include rental rate information
    populateVehicleDropdown() {
        const vehicleSelect = document.getElementById("vehicleSelect");
        if (vehicleSelect) {
            vehicleSelect.innerHTML = `<option value="" disabled selected>Select a vehicle</option>`;
            this.vehicles.forEach(vehicle => {
                const option = document.createElement("option");
                option.value = vehicle._id;
                option.textContent = `${vehicle.name} - Rs. ${vehicle.rentalRate}/day`;
                vehicleSelect.appendChild(option);
            });
        }
    }

    // Populate customer dropdown in bookings.html
    populateCustomerDropdown() {
        const customerSelect = document.getElementById("customerSelect");
        if (customerSelect) {
            customerSelect.innerHTML = `<option value="" disabled selected>Select a customer</option>`;
            this.customers.forEach(customer => {
                const option = document.createElement("option");
                option.value = customer._id;
                option.textContent = customer.name;
                customerSelect.appendChild(option);
            });
        }
    }
}

// Initialize the VRMS instance
const vrms = new VRMS();

// Utility functions for showing and clearing errors
function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearError(elementId) {
    document.getElementById(elementId).textContent = "";
}

// Delete Vehicle
// async function deleteVehicle(vehicleId) {
//     try {
//         const response = await fetch(`http://localhost:3000/api/vehicles/${vehicleId}`, {
//             method: 'DELETE'
//         });

//         const data = await response.json();
//         if (!response.ok) {
//             alert(data.error || "Failed to delete vehicle");
//         } else {
//             alert("Vehicle deleted successfully");
//             await vrms.fetchVehicles(); // Refresh the list after deletion
//         }
//     } catch (error) {
//         console.error("Failed to delete vehicle:", error);
//     }
// }

async function cancelBooking(bookingId) {
    try {
        // Find the button element and remove focus after clicking
        const button = document.querySelector(`button[onclick="cancelBooking('${bookingId}')"]`);

        const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.error || "Failed to cancel booking");
        } else {
            alert("Booking cancelled successfully");
            await vrms.fetchBookings(); // Refresh the list after cancellation
        }

        // Blur the button to remove the clicked/focused state
        if (button) {
            button.blur();
        }
    } catch (error) {
        console.error("Failed to cancel booking:", error);
    }
}



// Vehicle Form Submission with Backend Integration
document.getElementById("vehicleForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = document.querySelector("#vehicleForm button[type='submit']");

    const vehicleNo = document.getElementById("vehicleNo").value.trim();
    const name = document.getElementById("vehicleName").value.trim();
    const type = document.getElementById("vehicleType").value.trim();
    const rentalRate = parseFloat(document.getElementById("rentalRate").value);
    let isValid = true;

    if (!name) {
        showError("vehicleNameError", "Please enter the vehicle name.");
        isValid = false;
    } else {
        clearError("vehicleNameError");
    }

    if (!type) {
        showError("vehicleTypeError", "Please enter the vehicle type.");
        isValid = false;
    } else {
        clearError("vehicleTypeError");
    }

    if (isNaN(rentalRate) || rentalRate <= 0) {
        showError("rentalRateError", "Please enter a valid positive number for the rental rate.");
        isValid = false;
    } else {
        clearError("rentalRateError");
    }

    if (isValid) {
        const response = await fetch('http://localhost:3000/api/vehicles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicleNo, name, type, rentalRate })
        });

        if (response.ok) {
            await vrms.fetchVehicles(); // Re-fetch vehicle list after submission
            event.target.reset();
            clearError("vehicleError");
        } else {
            showError("vehicleError", "Failed to add vehicle.");
        }
    }

    // Remove focus from submit button after submission
    if (submitButton) {
        submitButton.blur();
    }

});

// Customer Form Submission with Backend Integration
document.getElementById("customerForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = document.querySelector("#customerForm button[type='submit']");

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
    let isValid = true;

    if (!name) {
        showError("customerNameError", "Please enter the customer name.");
        isValid = false;
    } else {
        clearError("customerNameError");
    }

    if (!emailPattern.test(email)) {
        showError("customerEmailError", "Please enter a valid email address.");
        isValid = false;
    } else {
        clearError("customerEmailError");
    }

    if (!phonePattern.test(phone)) {
        showError("customerPhoneError", "Please enter a valid 10-digit phone number.");
        isValid = false;
    } else {
        clearError("customerPhoneError");
    }

    if (isValid) {
        const response = await fetch('http://localhost:3000/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone })
        });

        if (response.ok) {
            await vrms.fetchCustomers(); // Re-fetch customer list after submission
            event.target.reset();
            clearError("customerError");
        } else {
            showError("customerError", "Failed to add customer");
        }
    }

    // Remove focus from submit button after submission
    if (submitButton) {
        submitButton.blur();
    }
});

// Booking Form Submission with Backend Integration
document.getElementById("bookingForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = document.querySelector("#bookingForm button[type='submit']");

    const vehicleId = document.getElementById("vehicleSelect").value;
    const customerId = document.getElementById("customerSelect").value;
    const startDate = document.getElementById("rentalStartDate").value;
    const endDate = document.getElementById("rentalEndDate").value;
    let isValid = true;

    // Convert to Date objects for comparison and set to midnight for accurate date-only comparison
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Today's date at midnight

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Start date at midnight

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0); // End date at midnight

    // Validation for vehicle selection
    if (!vehicleId) {
        showError("vehicleSelectError", "Please select a vehicle.");
        isValid = false;
    } else {
        clearError("vehicleSelectError");
    }

    // Validation for customer selection
    if (!customerId) {
        showError("customerSelectError", "Please select a customer.");
        isValid = false;
    } else {
        clearError("customerSelectError");
    }

    // Validation for start date
    if (!startDate) {
        showError("rentalStartDateError", "Please select a start date.");
        isValid = false;
    } else if (start <= currentDate) {  // Ensure start is strictly after today
        showError("rentalStartDateError", "Start date must be after today's date.");
        isValid = false;
    } else {
        clearError("rentalStartDateError");
    }

    // Validation for end date
    if (!endDate) {
        showError("rentalEndDateError", "Please select an end date.");
        isValid = false;
    } else if (end <= start) {  // Ensure end is after start
        showError("rentalEndDateError", "End date must be after the start date.");
        isValid = false;
    } else {
        clearError("rentalEndDateError");
    }

    // Proceed with booking if all validations pass
    if (isValid) {
        const response = await fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicle: vehicleId, customer: customerId, startDate, endDate })
        });

        if (response.ok) {
            await vrms.fetchBookings(); // Re-fetch booking list after submission
            event.target.reset();
            clearError("bookingError");
        } else {
            showError("bookingError", "Failed to create booking");
        }
    }

    // Remove focus from submit button after submission
    if (submitButton) {
        submitButton.blur();
    }
});
