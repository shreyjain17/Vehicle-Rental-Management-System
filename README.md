# Vehicle Rental Management System (VRMS)

An automated solution to manage vehicle rental operations efficiently. This system replaces outdated, manual methods by automating inventory management, customer data handling, and transaction processing. It improves operational efficiency and enhances customer service for rental companies.

## Features

- **Vehicle Management**: Add, view, and delete vehicle information, including vehicle number, type, and rental rate.
- **Customer Management**: Register new customers and manage customer information, including name, email, and phone.
- **Booking Management**: Create bookings for customers with chosen vehicles, specify rental dates, and calculate the rental cost.
- **Data Fetching and Updating**: All vehicle, customer, and booking data are fetched and updated dynamically on relevant pages.

## Project Structure

- **HTML Files**:
  - `index.html`: Home page of the VRMS.
  - `vehicles.html`: Manage vehicles, including adding new vehicles and viewing the list of available vehicles.
  - `customers.html`: Manage customer data, including adding new customers and viewing registered customers.
  - `bookings.html`: Create and manage bookings, allowing date selection and dynamic cost calculation.

- **JavaScript (app.js)**:
  - Implements the VRMS class, responsible for:
    - Fetching and updating vehicle, customer, and booking data.
    - Dynamically updating the DOM with vehicle, customer, and booking details.
    - Handling form submissions and error messages for validation.
    - Integrating with backend APIs for CRUD operations on vehicles, customers, and bookings.

## How to Use

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shreyjain17/Vehicle-Rental-Management-System
   ```
2. **Run the Backend**:
   Ensure the backend server is running on `localhost:3000` and provides the following endpoints:
   - `GET /api/vehicles`: Fetch all vehicles.
   - `POST /api/vehicles`: Add a new vehicle.
   - `DELETE /api/vehicles/:id`: Delete a vehicle.
   - `GET /api/customers`: Fetch all customers.
   - `POST /api/customers`: Add a new customer.
   - `GET /api/bookings`: Fetch all bookings.
   - `POST /api/bookings`: Create a new booking.
   - `DELETE /api/bookings/:id`: Cancel a booking.

3. **Open the Project**:
   - Open `index.html` in a browser to access the VRMS homepage.
   - Use the navigation menu to access the `Vehicles`, `Customers`, and `Bookings` pages.

4. **Manage Data**:
   - Navigate to each page to add, view, and manage vehicles, customers, and bookings.

## Technical Specifications

- **Frontend**: HTML, CSS, Bootstrap for styling, JavaScript for dynamic functionality.
- **Backend**: API-based backend (Node.js/Express) expected at `localhost:3000`.
- **Data Handling**:
  - AJAX calls to fetch and update data in real time.
  - Form validation for data integrity and improved user experience.
