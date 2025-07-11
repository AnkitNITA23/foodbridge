import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/profile-setup");
    } catch (err) {
      alert("Signup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6 border border-gray-200">
        <div className="flex flex-col items-center">
          <FaUserPlus size={32} className="text-[#2D9C6A] mb-2" />
          <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
          <p className="text-sm text-gray-500 text-center">
            Join FoodBridge to start donating or receiving food.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-[#2D9C6A] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-[#2D9C6A] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D9C6A] text-white py-2 rounded-md font-semibold hover:bg-[#247e58] transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#2D9C6A] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
