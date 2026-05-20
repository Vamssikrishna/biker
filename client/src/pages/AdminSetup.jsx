import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminSetup() {
  const navigate = useNavigate();
  const { setupAdmin } = useAuth();
  const [adminExists, setAdminExists] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  useEffect(() => {
    api
      .get("/auth/admin-status")
      .then(({ data }) => setAdminExists(data.adminExists))
      .catch(() => setAdminExists(false));
  }, []);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    try {
      await setupAdmin(form);
      toast.success("Admin account configured");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not configure admin account");
    }
  }

  if (adminExists) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-3xl place-items-center px-6 py-12">
        <div className="glass rounded-[2rem] p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-mint">Admin configured</p>
          <h1 className="mt-4 text-4xl font-black">The platform admin account already exists.</h1>
          <p className="mt-4 text-white/60">Use the login page to access the admin dashboard.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-mint">One-time setup</p>
        <h1 className="mt-4 text-5xl font-black">Create the first administrator.</h1>
        <p className="mt-4 text-white/60">
          This page works only while no admin account exists. After setup, the endpoint is locked automatically.
        </p>
      </div>
      <form className="glass space-y-4 rounded-[2rem] p-8" onSubmit={submit}>
        <input className="input" required placeholder="Admin full name" value={form.name} onChange={(event) => update("name", event.target.value)} />
        <input className="input" required type="email" placeholder="Admin email" value={form.email} onChange={(event) => update("email", event.target.value)} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
        <input className="input" required minLength={8} type="password" placeholder="Strong password" value={form.password} onChange={(event) => update("password", event.target.value)} />
        <button className="btn-primary w-full" type="submit">
          Configure admin
        </button>
      </form>
    </main>
  );
}
