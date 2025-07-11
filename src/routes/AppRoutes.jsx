import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProfileSetup from "../pages/ProfileSetup";
import Dashboard from "../pages/Dashboard";
import DonationForm from "../pages/DonationForm";
import ClaimDonation from "../pages/ClaimDonation";
import MyDonations from "../pages/MyDonations";

export default function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Checking authentication...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/donate" element={<DonationForm />} />
      <Route path="/claim/:id" element={<ClaimDonation />} />
      <Route path="/my-donations" element={<MyDonations />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-2xl text-gray-700">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}
