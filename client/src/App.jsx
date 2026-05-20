import { Navigate, Route, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSetup from "./pages/AdminSetup";
import AuthPage from "./pages/AuthPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import Landing from "./pages/Landing";
import OwnerDashboard from "./pages/OwnerDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import SearchVehicles from "./pages/SearchVehicles";
import { useAuth } from "./context/AuthContext";

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const byRole = {
    customer: <CustomerDashboard />,
    owner: <OwnerDashboard />,
    rider: <RiderDashboard />,
    admin: <AdminDashboard />
  };
  return byRole[user.role] || <CustomerDashboard />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/setup-admin" element={<AdminSetup />} />
        <Route path="/vehicles" element={<SearchVehicles />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Chatbot />
    </div>
  );
}
