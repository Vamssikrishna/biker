import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { api } from "../api/client";
import StatCard from "../components/StatCard";

export default function RiderDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [otp, setOtp] = useState("");

  async function load() {
    const { data } = await api.get("/deliveries");
    setDeliveries(data.deliveries);
  }

  useEffect(() => {
    load().catch(() => toast.error("Could not load deliveries"));
  }, []);

  async function updateDelivery(delivery, status) {
    const currentLocation = {
      lat: (delivery.currentLocation?.lat || 28.61) + 0.01,
      lng: (delivery.currentLocation?.lng || 77.2) + 0.01
    };
    await api.patch(`/deliveries/${delivery._id}`, { status, currentLocation, etaMinutes: status === "delivered" ? 0 : 10 });
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    socket.emit("rider:location", { bookingId: delivery.booking?._id, location: currentLocation, etaMinutes: 10 });
    socket.disconnect();
    toast.success("Delivery updated");
    load();
  }

  async function verifyOtp(bookingId) {
    await api.post(`/bookings/${bookingId}/verify-otp`, { otp });
    toast.success("OTP verified and handover completed");
    setOtp("");
    load();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-bold uppercase tracking-[0.4em] text-mint">Rider operations</p>
      <h1 className="mt-2 text-4xl font-black">Pickup, tracking, and secure handover</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Assigned deliveries" value={deliveries.length} />
        <StatCard label="Active route" value={deliveries.filter((d) => d.status !== "delivered").length} />
        <StatCard label="Completed" value={deliveries.filter((d) => d.status === "delivered").length} />
      </div>
      <div className="mt-10 grid gap-5">
        {deliveries.map((delivery) => (
          <div key={delivery._id} className="glass rounded-[2rem] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">
                  {delivery.booking?.vehicle?.brand} {delivery.booking?.vehicle?.model}
                </h2>
                <p className="mt-1 text-white/60">
                  {delivery.routeSummary} · ETA {delivery.etaMinutes} min · {delivery.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-ghost" onClick={() => updateDelivery(delivery, "picked_up")}>
                  Mark picked up
                </button>
                <button className="btn-ghost" onClick={() => updateDelivery(delivery, "arriving_customer")}>
                  Update location
                </button>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
              <input className="input" placeholder="Customer OTP" value={otp} onChange={(event) => setOtp(event.target.value)} />
              <button className="btn-primary" onClick={() => verifyOtp(delivery.booking?._id)}>
                Verify handover
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
