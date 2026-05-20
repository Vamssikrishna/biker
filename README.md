# RideBridge AI Vehicle Rental Platform

RideBridge is a production-style MERN peer-to-peer bike and car rental platform with delivery riders, role-based dashboards, OTP handover, simulated online payments, admin verification, and AI-assisted operations. The application starts with an empty database and does not include predefined users, vehicles, bookings, or test credentials.

## Features

- Secure JWT authentication with customer, owner, rider, and admin roles.
- Owner vehicle listing with images, pricing, availability, documents, and admin approval.
- Customer search, filters, AI recommendations, booking, mock payment, booking history, and OTP handover.
- Rider dashboard for assigned deliveries, pickup/drop updates, live Socket.io location events, and OTP verification.
- Admin dashboard for approvals, users, analytics, AI demand prediction, and fraud alerts.
- AI services for recommendations, rider matching, dynamic pricing, demand prediction, fraud scoring, and OpenAI-powered chatbot support.
- Modern animated React UI using Vite, Framer Motion, Tailwind CSS, and Lucide icons.

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Framer Motion, Axios, Socket.io client.
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Socket.io, OpenAI SDK.
- Database: MongoDB local or Atlas.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret. Add `OPENAI_API_KEY` to enable the chatbot.

4. Optional: verify the database connection. This does not insert any predefined data:

```bash
npm run seed
```

5. Start the app:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## Admin Setup

No admin account is created automatically.

When you are ready, open:

```text
http://localhost:5173/setup-admin
```

Create the first admin with your own email and password. This setup flow is automatically locked after the first admin account exists.

After admin setup, customers, vehicle owners, and delivery riders can register from the public registration page.

## Notes

- Payments are simulated through a mock payment endpoint so the flow works without gateway credentials.
- Map tracking uses Socket.io and simulated coordinates. Google Maps can be added by replacing the tracking panel with a Maps API component.
- The chatbot uses OpenAI when `OPENAI_API_KEY` is configured. Without it, the API returns a helpful setup message.
