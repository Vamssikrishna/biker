import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";
import StatCard from "../components/StatCard";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  async function load() {
    const [analyticsRes, usersRes, vehiclesRes] = await Promise.all([
      api.get("/admin/analytics"),
      api.get("/admin/users"),
      api.get("/vehicles?includePending=true&availability=")
    ]);
    setAnalytics(analyticsRes.data);
    setUsers(usersRes.data.users);
    setVehicles(vehiclesRes.data.vehicles);
  }

  useEffect(() => {
    load().catch(() => toast.error("Could not load admin dashboard"));
  }, []);

  async function approve(vehicleId, approvalStatus) {
    await api.patch(`/admin/vehicles/${vehicleId}/approval`, { approvalStatus });
    toast.success(`Vehicle ${approvalStatus}`);
    load();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-bold uppercase tracking-[0.4em] text-mint">Admin command center</p>
      <h1 className="mt-2 text-4xl font-black">Trust, safety, and platform analytics</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Users" value={analytics?.users || 0} />
        <StatCard label="Vehicles" value={analytics?.vehicles || 0} />
        <StatCard label="Bookings" value={analytics?.bookings || 0} />
        <StatCard label="Commission" value={`₹${analytics?.revenue || 0}`} />
      </div>
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">Vehicle verification queue</h2>
          <div className="mt-5 space-y-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="flex items-center justify-between gap-4 rounded-2xl bg-white/8 p-4">
                <div>
                  <p className="font-black">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="text-sm text-white/55">{vehicle.approvalStatus}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-ghost" onClick={() => approve(vehicle._id, "approved")}>
                    Approve
                  </button>
                  <button className="btn-ghost" onClick={() => approve(vehicle._id, "rejected")}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">AI risk and demand</h2>
          <div className="mt-5 space-y-3">
            {(analytics?.demand || []).map((item) => (
              <div key={item.city} className="rounded-2xl bg-white/8 p-4">
                <p className="font-black">{item.city}</p>
                <p className="text-sm text-white/55">
                  Demand {item.prediction} · score {item.demandScore} · bookings {item.bookings}
                </p>
              </div>
            ))}
            {(analytics?.fraudAlerts || []).map((booking) => (
              <div key={booking._id} className="rounded-2xl border border-amber/40 bg-amber/10 p-4">
                Fraud score {booking.fraudScore}: {booking.customer?.name} booking {booking.vehicle?.brand}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-6 glass rounded-[2rem] p-6">
        <h2 className="text-2xl font-black">Users</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {users.slice(0, 12).map((user) => (
            <div key={user._id} className="rounded-2xl bg-white/8 p-4">
              <p className="font-black">{user.name}</p>
              <p className="text-sm text-white/55">
                {user.role} · {user.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
