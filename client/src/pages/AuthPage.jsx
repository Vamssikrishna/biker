import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    city: "",
    address: ""
  });

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = isRegister
        ? {
            ...form,
            location: {
              label: form.address || form.city,
              address: form.address,
              city: form.city
            }
          }
        : { email: form.email, password: form.password };
      await (isRegister ? register(payload) : login(payload));
      toast.success("Welcome to RideBridge");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-mint">Secure access</p>
        <h1 className="mt-4 text-5xl font-black">{isRegister ? "Create your mobility account." : "Welcome back."}</h1>
        <p className="mt-4 text-white/60">
          Use customer, owner, rider, or admin dashboards to manage the complete rental and delivery lifecycle.
        </p>
      </motion.div>
      <form className="glass space-y-4 rounded-[2rem] p-8" onSubmit={submit}>
        {isRegister ? (
          <>
            <input className="input" placeholder="Full name" value={form.name} onChange={(event) => update("name", event.target.value)} />
            <input className="input" placeholder="Phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            <input className="input" placeholder="City" value={form.city} onChange={(event) => update("city", event.target.value)} />
            <input className="input" placeholder="Address" value={form.address} onChange={(event) => update("address", event.target.value)} />
            <select className="input" value={form.role} onChange={(event) => update("role", event.target.value)}>
              <option value="customer">Customer</option>
              <option value="owner">Vehicle Owner</option>
              <option value="rider">Delivery Rider</option>
            </select>
          </>
        ) : null}
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} />
        <button className="btn-primary w-full" type="submit">
          {isRegister ? "Create account" : "Login"}
        </button>
        <p className="text-center text-sm text-white/60">
          {isRegister ? "Already registered?" : "Need an account?"}{" "}
          <Link className="font-bold text-mint" to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </form>
    </main>
  );
}
