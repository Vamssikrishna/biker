import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";
import StatCard from "../components/StatCard";
import VehicleCard from "../components/VehicleCard";
import { useAuth } from "../context/AuthContext";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    type: "bike",
    brand: "",
    model: "",
    registrationNumber: "",
    pricePerHour: "",
    pricePerDay: "",
    securityDeposit: "",
    city: "",
    address: "",
    imageUrl: "",
    description: ""
  });

  async function load() {
    const [vehicleRes, bookingRes] = await Promise.all([
      api.get(`/vehicles?owner=${user._id}&includePending=true&availability=`),
      api.get("/bookings")
    ]);
    setVehicles(vehicleRes.data.vehicles);
    setBookings(bookingRes.data.bookings);
  }

  useEffect(() => {
    if (user) load().catch(() => toast.error("Could not load owner dashboard"));
  }, [user]);

  async function addVehicle(event) {
    event.preventDefault();
    await api.post("/vehicles", {
      ...form,
      pricePerHour: Number(form.pricePerHour),
      pricePerDay: Number(form.pricePerDay),
      securityDeposit: Number(form.securityDeposit || 0),
      images: form.imageUrl ? [form.imageUrl] : [],
      location: {
        label: form.address || form.city,
        address: form.address,
        city: form.city
      }
    });
    toast.success("Vehicle submitted for admin approval");
    load();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-bold uppercase tracking-[0.4em] text-mint">Owner dashboard</p>
      <h1 className="mt-2 text-4xl font-black">Earn from unused vehicles</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Vehicles listed" value={vehicles.length} />
        <StatCard label="Rental requests" value={bookings.length} />
        <StatCard label="Owner earnings" value={`₹${user?.earnings || 0}`} hint="After platform commission" />
      </div>
      <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="glass space-y-4 rounded-[2rem] p-6" onSubmit={addVehicle}>
          <h2 className="text-2xl font-black">Add a vehicle</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {["brand", "model", "registrationNumber", "pricePerHour", "pricePerDay", "securityDeposit"].map((key) => (
              <input key={key} className="input" required value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} placeholder={key} />
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input" required placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            <input className="input" required placeholder="Pickup address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          </div>
          <input className="input" placeholder="Vehicle image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          <textarea className="input min-h-28" placeholder="Vehicle description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <select className="input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option value="bike">Bike</option>
            <option value="car">Car</option>
          </select>
          <button className="btn-primary w-full">Submit for verification</button>
        </form>
        <div className="grid gap-5 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      </section>
    </main>
  );
}
