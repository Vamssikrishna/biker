import { Link, NavLink } from "react-router-dom";
import { Bike, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 text-xl font-black">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-ink">
            <Bike size={22} />
          </span>
          RideBridge
        </Link>
        <div className="hidden items-center gap-6 text-sm text-white/75 md:flex">
          <NavLink to="/vehicles">Explore</NavLink>
          <a href="/#ai">AI Engine</a>
          <a href="/#features">Features</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link className="btn-ghost hidden sm:inline-flex" to="/dashboard">
                {user.role} dashboard
              </Link>
              <button className="btn-primary flex items-center gap-2" onClick={logout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn-primary" to="/register">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
