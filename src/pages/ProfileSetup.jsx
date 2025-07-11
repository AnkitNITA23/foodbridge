import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileSetup() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [role, setRole] = useState("donor");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !pincode || !role) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name,
        address,
        pincode,
        role,
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Error saving profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full space-y-6 border border-gray-200"
      >
        <div className="text-center">
          <FaUserCircle size={40} className="text-[#2D9C6A] mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Complete Your Profile</h2>
          <p className="text-sm text-gray-500">Tell us a bit about yourself to get started</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-[#2D9C6A] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main Street, City"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-[#2D9C6A] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Pin Code</label>
          <input
            type="text"
            required
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="123456"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-[#2D9C6A] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-[#2D9C6A] outline-none"
          >
            <option value="donor">Donor</option>
            <option value="ngo">NGO</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2D9C6A] text-white py-2 rounded-md font-semibold hover:bg-[#247e58] transition"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}
