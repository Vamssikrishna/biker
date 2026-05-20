import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import StatCard from "../components/StatCard";
import VehicleCard from "../components/VehicleCard";

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  async function load() {
    const [bookingRes, recRes] = await Promise.all([api.get("/bookings"), api.get("/vehicles/recommendations")]);
    setBookings(bookingRes.data.bookings);
    setRecommendations(recRes.data.vehicles);
  }

  useEffect(() => {
    load().catch(() => toast.error("Could not load dashboard"));
  }, []);

  async function pay(bookingId) {
    await api.post(`/bookings/${bookingId}/pay`, { method: "upi" });
    toast.success("Mock payment completed");
    load();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-mint">Customer cockpit</p>
          <h1 className="mt-2 text-4xl font-black">Bookings, payments, and AI picks</h1>
        </div>
        <Link className="btn-primary" to="/vehicles">
          Book a vehicle
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total bookings" value={bookings.length} />
        <StatCard label="Active rentals" value={bookings.filter((b) => ["delivered", "active"].includes(b.status)).length} />
        <StatCard label="Pending payments" value={bookings.filter((b) => b.paymentStatus === "pending").length} />
      </div>
      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="glass rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">Ride management</h2>
          <div className="mt-5 space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-2xl bg-white/8 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black">
                      {booking.vehicle?.brand} {booking.vehicle?.model}
                    </p>
                    <p className="text-sm text-white/55">
                      {booking.status} · payment {booking.paymentStatus} · ETA {booking.rider ? "assigned" : "pending"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {booking.paymentStatus === "pending" ? (
                      <button className="btn-primary" onClick={() => pay(booking._id)}>
                        Pay ₹{booking.totalAmount}
                      </button>
                    ) : null}
                    <span className="btn-ghost">OTP secured</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-black">Recommended for you</h2>
          <div className="space-y-5">
            {recommendations.slice(0, 2).map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
