# 🚗 DriverLink

> **The "Uber for personal drivers" — connecting car owners with verified local drivers in Zamboanga City, Philippines.**

[![Live Demo](https://img.shields.io/badge/Live-driverbooking.vercel.app-1a5c9a?style=for-the-badge)](https://driverbooking.vercel.app)
[![Built with React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 📱 What is DriverLink?

DriverLink is different from ride-hailing apps like Grab. Instead of matching passengers with a car and driver, **DriverLink matches people who already have a vehicle with a verified local driver**.

**Use cases:**
- 🍺 Need a designated driver after drinking
- 🚗 Need someone to drive your car on a long trip
- 👴 Need a temporary driver for elderly parents
- 💼 Need a driver for a business trip
- ⏱️ Need an hourly driver for errands

---

## ✨ Features

### For Customers
- 📍 Book a verified driver by trip type, date, and duration
- 🗺️ Interactive map of Zamboanga City with real-time driver locations
- 💰 Fare estimates before booking
- 📲 Real-time booking confirmations
- ⭐ Driver ratings and reviews
- 👤 Customer profile with booking history

### For Drivers
- 📊 Driver dashboard with earnings and trip stats
- 🔔 Real-time booking notifications (in-app + email)
- ✅ Accept or decline bookings instantly
- 🪪 Profile with NBI clearance and license verification
- 📅 Booking history and weekly earnings breakdown
- 🟢 Online/offline toggle

### Platform
- 🔐 Secure email authentication (Supabase Auth)
- 📧 Email notifications via Resend
- 🗺️ Free interactive maps via Leaflet + OpenStreetMap
- 📱 Mobile app via Capacitor (iOS & Android)
- 💳 GCash / PayMaya / Cash payment support (coming soon)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Custom CSS with DM Sans + DM Serif Display |
| Icons | Lucide React |
| Maps | Leaflet + OpenStreetMap (free) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Real-time | Supabase Realtime |
| Email | Resend + Supabase Edge Functions |
| Hosting | Vercel |
| Mobile | Capacitor (iOS + Android) |
| Version Control | GitHub |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- A Supabase account (free)
- A Vercel account (free)

### Installation

```bash
# Clone the repository
git clone https://github.com/klaayd39/Driver-Booking.git
cd Driver-Booking

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Environment Variables

Create a `src/lib/supabase.js` file with your Supabase credentials:

```js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'your-supabase-project-url'
const SUPABASE_ANON_KEY = 'your-supabase-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

---

## 🗄️ Database Schema

```sql
-- Drivers table
create table drivers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text,
  location text,
  bio text,
  rating numeric default 5.0,
  trips integer default 0,
  status text default 'offline',
  nbi_verified boolean default false,
  licensed boolean default false,
  created_at timestamp default now()
);

-- Bookings table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid,
  customer_name text,
  driver_id text,
  driver_name text,
  trip_type text,
  pickup text,
  destination text,
  date text,
  time text,
  duration text,
  fare numeric,
  status text default 'pending',
  created_at timestamp default now()
);

-- Reviews table
create table reviews (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references bookings(id),
  driver_id text,
  rating integer,
  comment text,
  created_at timestamp default now()
);
```

---

## 📁 Project Structure

```
driverlink/
├── src/
│   ├── components/
│   │   ├── UI.jsx          # Reusable UI components
│   │   ├── Sidebar.jsx     # Desktop navigation
│   │   ├── BottomNav.jsx   # Mobile navigation
│   │   ├── TopBar.jsx      # Header with mode toggle
│   │   ├── DriverCard.jsx  # Driver listing card
│   │   ├── BookingModal.jsx # Booking form modal
│   │   ├── BookingAlert.jsx # Real-time driver notifications
│   │   └── MapView.jsx     # Leaflet map component
│   ├── context/
│   │   └── AppContext.jsx  # Global state management
│   ├── lib/
│   │   └── supabase.js     # Supabase client
│   ├── pages/
│   │   ├── BookPage.jsx        # Customer booking page
│   │   ├── DriversPage.jsx     # Browse drivers
│   │   ├── BookingsPage.jsx    # Customer trip history
│   │   ├── ProfilePage.jsx     # Customer profile
│   │   ├── DriverDashPage.jsx  # Driver dashboard
│   │   ├── DriverBookingsPage.jsx
│   │   ├── DriverProfilePage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── AuthPage.jsx        # Login / Sign up
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   └── functions/
│       └── notify-driver/  # Email notification edge function
│           └── index.ts
├── ios/                    # Capacitor iOS project
├── android/                # Capacitor Android project
├── capacitor.config.json
└── package.json
```

---

## 📦 Deployment

### Deploy to Vercel

```bash
# Build the project
npm run build

# Push to GitHub — Vercel auto-deploys
git add .
git commit -m "your message"
git push
```

### Deploy Supabase Edge Functions

```bash
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy notify-driver
```

### Build Mobile App (iOS)

```bash
npm run build
npx cap sync ios
npx cap open ios
# Then press Run in Xcode
```

### Build Mobile App (Android)

```bash
npm run build
npx cap sync android
npx cap open android
# Then press Run in Android Studio
```

---

## 🗺️ Roadmap

- [x] Customer booking flow
- [x] Driver dashboard
- [x] Real-time notifications
- [x] Interactive map (Zamboanga City)
- [x] Email notifications
- [x] User authentication
- [x] iOS mobile app
- [x] Android mobile app
- [ ] In-app chat (customer ↔ driver)
- [ ] GCash / PayMongo payments
- [ ] Driver registration flow
- [ ] Ratings & reviews
- [ ] Custom domain (driverbooking.ph)
- [ ] Push notifications

---

## 👨‍💻 Developer

**Klyde Joseph Yabo**
- 📧 klydejosephy@gmail.com
- 🌍 Zamboanga City, Philippines
- 🐙 [@klaayd39](https://github.com/klaayd39)

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

<div align="center">
  <p>Built with ❤️ in Zamboanga City, Philippines 🇵🇭</p>
  <p><strong>DriverLink</strong> — Your trusted local driver, on demand.</p>
</div>
