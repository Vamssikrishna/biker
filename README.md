# RideBridge AI Vehicle Rental Platform

RideBridge is a production-style MERN web application for peer-to-peer bike and car rental with doorstep delivery. It connects customers, vehicle owners, delivery riders, and administrators through a single role-based platform.

The project is designed as a professional full-stack application, not a demo-data website. It starts with an empty database, does not include predefined users, vehicles, bookings, test emails, or demo passwords, and provides a one-time first-admin setup flow.

## Project Purpose

Urban users often need temporary access to bikes or cars without visiting a physical rental shop. At the same time, many private owners have vehicles sitting unused. RideBridge solves this by allowing owners to list vehicles, customers to book them online, riders to deliver them, and admins to verify and monitor the platform.

The platform also includes AI-assisted operations for vehicle recommendations, delivery rider matching, dynamic pricing, demand prediction, fraud scoring, and chatbot support.

## Core Roles

### Customer

Customers can register, browse vehicles, filter by location/type/price, book a vehicle, enter a delivery location, complete a mock online payment, track delivery progress, confirm OTP handover, and view booking history.

### Vehicle Owner

Owners can register, add vehicles, provide vehicle details, set hourly/daily pricing, define pickup location, submit image URLs, track booking requests, and view earnings.

### Delivery Rider

Riders can register, view assigned deliveries, update pickup/drop status, simulate location updates, and verify the customer OTP before completing the handover.

### Admin

Admins approve or reject vehicle listings, monitor users, view platform analytics, inspect demand prediction, review fraud alerts, and manage trust and safety. The first admin is created manually through a protected one-time setup page.

## Main Features

- JWT authentication with encrypted passwords using bcrypt.
- Role-based access control for customers, owners, riders, and admins.
- One-time first-admin setup at `/setup-admin`.
- Owner vehicle listing with type, brand, model, registration number, price, deposit, description, images, and location.
- Admin vehicle approval workflow before public availability.
- Vehicle discovery with filters for city, type, and price.
- AI recommendation scoring based on user history, proximity, pricing, popularity, and vehicle type.
- Booking workflow with rental duration, delivery location, price calculation, rider assignment, and OTP generation.
- AI rider matching based on rider availability, pickup distance, delivery distance, and rider rating.
- Mock payment flow with platform commission and owner payout calculation.
- Delivery tracking with Socket.io events and rider location updates.
- OTP-based vehicle handover to prevent unauthorized delivery completion.
- Owner earnings dashboard.
- Customer booking dashboard.
- Rider delivery operations dashboard.
- Admin analytics dashboard with revenue, users, vehicles, bookings, demand prediction, and fraud alerts.
- AI dynamic pricing based on time, demand, vehicle availability, and vehicle type.
- AI demand prediction from booking history grouped by location.
- AI fraud scoring for suspicious booking behavior.
- AI chatbot support using OpenAI when `OPENAI_API_KEY` is configured.
- Modern animated frontend built with React, Vite, Tailwind CSS, Framer Motion, and Lucide icons.

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- Zustand-ready architecture through context/state modules
- Socket.io client
- React Hot Toast
- Lucide React icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- Socket.io
- Helmet
- CORS
- Express Rate Limit
- Morgan logger
- OpenAI SDK

### Database

- MongoDB local instance or MongoDB Atlas cluster

## Folder Structure

```text
biker/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── styles/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── scripts/
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   └── ai/
│   │   └── socket/
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Install these before running the project:

- Node.js 18 or newer
- npm
- MongoDB Community Server or MongoDB Atlas
- Git

For local development, MongoDB should be running on:

```text
mongodb://127.0.0.1:27017
```

## Environment Variables

Create one `.env` file in the project root:

```text
biker/.env
```

Use this structure:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/biker_rental
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### Variable Details

- `NODE_ENV`: Runtime environment. Use `development` locally.
- `PORT`: Backend API port. Default is `5000`.
- `CLIENT_URL`: Frontend URL allowed by CORS.
- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret used to sign authentication tokens. Use a strong random value in production.
- `JWT_EXPIRES_IN`: JWT validity duration.
- `OPENAI_API_KEY`: Optional. Required only for live AI chatbot responses.
- `OPENAI_MODEL`: OpenAI model used by the chatbot.

If `OPENAI_API_KEY` is empty, the chatbot endpoint still works and returns a setup message instead of crashing.

## Installation

Clone the repository:

```bash
git clone https://github.com/Vamssikrishna/biker.git
cd biker
```

Install all workspace dependencies:

```bash
npm install
```

Create the root `.env` file:

```bash
cp .env.example .env
```

Update `.env` with your MongoDB URI and JWT secret.

## Running Locally

Start MongoDB first. Then run:

```bash
npm run dev
```

The app will run at:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

The backend health endpoint is:

```text
http://localhost:5000/api/health
```

## First Admin Setup

No admin account is created automatically.

After starting the project, open:

```text
http://localhost:5173/setup-admin
```

Create the first admin using your own name, email, phone, and password. Once an admin exists, this setup endpoint is locked automatically and cannot create another admin.

After this step:

- Admins can log in from `/login`.
- Customers, owners, and riders can register from `/register`.
- Vehicle owners can submit vehicles.
- Admins can approve vehicles.
- Customers can book approved vehicles.

## Database Initialization

This project intentionally does not seed predefined data.

You can verify the MongoDB connection with:

```bash
npm run seed
```

This command only checks the database connection and prints guidance. It does not create demo users, vehicles, bookings, or test accounts.

## Available Scripts

Run both frontend and backend:

```bash
npm run dev
```

Run only the backend:

```bash
npm run server
```

Run only the frontend:

```bash
npm run client
```

Build the frontend:

```bash
npm run build
```

Start the backend in production mode:

```bash
npm run start
```

Verify database connection:

```bash
npm run seed
```

## Backend API Overview

### Auth

- `POST /api/auth/register`: Register customer, owner, or rider.
- `POST /api/auth/login`: Login and receive JWT.
- `GET /api/auth/me`: Get current authenticated user.
- `PATCH /api/auth/me`: Update current user profile.
- `GET /api/auth/admin-status`: Check whether an admin exists.
- `POST /api/auth/setup-admin`: Create the first admin only if no admin exists.

### Vehicles

- `GET /api/vehicles`: Search approved available vehicles.
- `GET /api/vehicles/recommendations`: Get AI-ranked recommendations for the logged-in user.
- `POST /api/vehicles`: Owner/admin creates a vehicle listing.
- `GET /api/vehicles/:id`: Get vehicle details.
- `PATCH /api/vehicles/:id`: Update vehicle listing.
- `DELETE /api/vehicles/:id`: Delete vehicle listing.

### Bookings

- `GET /api/bookings`: Get bookings based on user role.
- `POST /api/bookings`: Create a booking and assign a rider if available.
- `PATCH /api/bookings/:id/status`: Update booking status.
- `POST /api/bookings/:id/pay`: Complete mock payment.
- `POST /api/bookings/:id/verify-otp`: Verify handover OTP.

### Deliveries

- `GET /api/deliveries`: Get rider/admin delivery list.
- `PATCH /api/deliveries/:id`: Update delivery status, ETA, and location.

### Reviews

- `POST /api/reviews`: Submit review.
- `GET /api/reviews`: List reviews by vehicle or rider.

### Admin

- `GET /api/admin/analytics`: Platform analytics, demand prediction, and fraud alerts.
- `GET /api/admin/users`: List users.
- `PATCH /api/admin/users/:id`: Update user status/details.
- `PATCH /api/admin/vehicles/:id/approval`: Approve or reject vehicle.

### AI

- `POST /api/ai/chat`: AI chatbot response.
- `GET /api/ai/demand`: Demand prediction.
- `GET /api/ai/pricing/:vehicleId`: Dynamic pricing preview.
- `GET /api/ai/risk`: Current user risk score.

## Application Workflows

### Vehicle Listing Workflow

1. Owner registers and logs in.
2. Owner adds a vehicle with pricing and location details.
3. Vehicle enters pending approval state.
4. Admin reviews the listing.
5. Admin approves the vehicle.
6. Approved vehicle appears in customer search results.

### Booking and Delivery Workflow

1. Customer searches vehicles.
2. Customer selects an approved vehicle.
3. Customer enters delivery address.
4. Backend calculates dynamic price.
5. Backend selects the best available rider.
6. Booking is created with a secure OTP.
7. Customer completes mock payment.
8. Rider picks up the vehicle.
9. Rider updates delivery location/status.
10. Customer shares OTP at handover.
11. Rider verifies OTP.
12. Booking is marked delivered.

### Admin Safety Workflow

1. Admin reviews pending vehicles.
2. Admin monitors total users, bookings, vehicles, and commission.
3. Fraud alerts are generated from suspicious booking patterns.
4. Demand prediction identifies high-demand locations.
5. Admin can suspend problematic users if needed.

## AI Modules

The AI modules are implemented under:

```text
server/src/services/ai/
```

### Recommendation Engine

Scores vehicles using:

- Booking history
- Preferred vehicle type
- Average price preference
- Vehicle popularity
- User-to-vehicle proximity

### Dynamic Pricing

Adjusts pricing using:

- Time of day
- Recent city demand
- Vehicle type
- Availability signals

### Rider Matching

Selects a rider using:

- Rider availability
- Distance from rider to pickup location
- Distance from pickup to customer delivery location
- Rider rating

### Demand Prediction

Aggregates recent bookings by city and assigns demand levels:

- Low
- Medium
- High

### Fraud Detection

Scores risk using signals such as:

- Too many recent bookings
- Failed payments
- Missing profile information
- Large delivery distance
- High-value booking
- Owner booking their own vehicle

### Chatbot

Uses OpenAI if configured. It assists users with:

- Booking questions
- Delivery tracking
- OTP handover
- Payment support
- Owner listing help
- Platform policy explanation

## Real-Time Tracking

Socket.io is used for real-time delivery updates. Riders can update their location and ETA, and booking rooms receive delivery update events.

The current implementation uses simulated coordinates for local development. A production version can replace this with Google Maps, Mapbox, or native mobile GPS updates.

## Payment Handling

Payments are simulated through a mock payment endpoint. The system still calculates:

- Rental charges
- Security deposit
- Delivery fee
- Platform commission
- Owner payout

This allows the full business flow to work locally without Razorpay, Stripe, or other payment gateway credentials. A real gateway can be integrated later at the payment route level.

## Security Notes

- Passwords are hashed with bcrypt.
- JWT tokens protect authenticated routes.
- Role middleware restricts protected actions.
- Helmet adds common security headers.
- Rate limiting protects `/api` routes.
- Admin setup is disabled after the first admin exists.
- `.env` is ignored by Git and should never be committed.

## Production Deployment Notes

Before deploying:

- Use MongoDB Atlas or a managed MongoDB provider.
- Set a strong `JWT_SECRET`.
- Set `NODE_ENV=production`.
- Configure `CLIENT_URL` to the deployed frontend domain.
- Add `OPENAI_API_KEY` only in the hosting provider environment.
- Replace mock payment flow with a real payment gateway.
- Replace simulated tracking with a real map/GPS provider.
- Use cloud storage for vehicle images and documents.
- Add email/SMS OTP delivery if required.

## Troubleshooting

### `MONGODB_URI is required`

Create a root `.env` file in the project folder and add `MONGODB_URI`.

### `MongooseServerSelectionError` or connection refused

MongoDB is not running or the URI is incorrect. Start MongoDB locally or update `MONGODB_URI` for MongoDB Atlas.

### `EADDRINUSE: address already in use`

Another process is already using the port. Stop the old dev server or change `PORT` in `.env`.

### Frontend opens on `5174`

Port `5173` is already in use. Stop the old Vite process and rerun `npm run dev`.

### Chatbot says AI is not configured

Add `OPENAI_API_KEY` to `.env` and restart the backend.

## Repository

GitHub repository:

```text
https://github.com/Vamssikrishna/biker
```
