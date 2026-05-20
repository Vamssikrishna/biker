import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";
import VehicleCard from "../components/VehicleCard";
import { useAuth } from "../context/AuthContext";

export default function SearchVehicles() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({ city: "", type: "", maxPrice: "" });
  const [bookingVehicle, setBookingVehicle] = useState(null);
  const [deliveryLabel, setDeliveryLabel] = useState("");

  async function load() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    const { data } = await api.get(`/vehicles?${params.toString()}`);
    setVehicles(data.vehicles);
  }

  useEffect(() => {
    load().catch(() => setVehicles([]));
  }, []);

  async function createBooking() {
    if (!user) return toast.error("Please login to book");
    try {
      const startAt = new Date(Date.now() + 1000 * 60 * 60);
      const endAt = new Date(Date.now() + 1000 * 60 * 60 * 7);
      const { data } = await api.post("/bookings", {
        vehicleId: bookingVehicle._id,
        startAt,
        endAt,
        deliveryLocation: {
          label: deliveryLabel,
          address: deliveryLabel,
          city: bookingVehicle.location?.city,
          lat: bookingVehicle.location?.lat,
          lng: bookingVehicle.location?.lng
        }
      });
      toast.success(`Booked. Demo handover OTP: ${data.handoverOtp}`);
      setBookingVehicle(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-mint">Vehicle discovery</p>
          <h1 className="mt-3 text-4xl font-black">Find verified rides near you</h1>
        </div>
        <div className="glass grid gap-3 rounded-3xl p-3 md:grid-cols-4">
          <input className="input" placeholder="City" value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })} />
          <select className="input" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
            <option value="">Any type</option>
            <option value="bike">Bike</option>
            <option value="car">Car</option>
          </select>
          <input className="input" placeholder="Max hourly price" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} />
          <button className="btn-primary" onClick={load}>
            Search
          </button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle._id} vehicle={vehicle} onBook={setBookingVehicle} />
        ))}
      </div>
      {bookingVehicle ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6">
          <div className="glass w-full max-w-lg rounded-[2rem] p-6">
            <h2 className="text-2xl font-black">Confirm delivery booking</h2>
            <p className="mt-2 text-white/60">
              {bookingVehicle.brand} {bookingVehicle.model} will be assigned to the best available rider.
            </p>
            <input className="input mt-5" placeholder="Enter delivery address" value={deliveryLabel} onChange={(event) => setDeliveryLabel(event.target.value)} />
            <div className="mt-5 flex gap-3">
              <button className="btn-primary flex-1" onClick={createBooking}>
                Confirm booking
              </button>
              <button className="btn-ghost" onClick={() => setBookingVehicle(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
