import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  PackageOpen,
  MapPin,
  Loader2,
  LogOut,
  PlusCircle,
  Eye,
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [liveDonations, setLiveDonations] = useState([]);
  const [pickedUpDonations, setPickedUpDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data());
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!userData) return;

    const fetchDonations = async () => {
      setLoading(true);
      let live = [];
      let picked = [];

      try {
        if (userData.role === "ngo") {
          const pendingQuery = query(
            collection(db, "donations"),
            where("pincode", "==", userData.pincode)
          );
          const pendingSnap = await getDocs(pendingQuery);
          pendingSnap.docs.forEach(doc => {
            const data = { id: doc.id, ...doc.data() };
            if (
              data.status === "pending" ||
              (data.status === "claimed" && data.claimedBy === user.uid)
            ) {
              live.push(data);
            } else if (
              data.status === "picked_up" &&
              data.claimedBy === user.uid
            ) {
              picked.push(data);
            }
          });
        } else {
          const donorQuery = query(
            collection(db, "donations"),
            where("donorId", "==", user.uid)
          );
          const donorSnap = await getDocs(donorQuery);
          donorSnap.docs.forEach(doc => {
            const data = { id: doc.id, ...doc.data() };
            if (data.status === "pending" || data.status === "claimed") {
              live.push(data);
            } else if (data.status === "picked_up") {
              picked.push(data);
            }
          });
        }

        setLiveDonations(live);
        setPickedUpDonations(picked);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userData, user]);

  const getBadge = count => {
    if (count >= 10) return "Gold";
    if (count >= 5) return "Silver";
    if (count >= 1) return "Bronze";
    return null;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleMarkPickedUp = async donationId => {
    try {
      const donationRef = doc(db, "donations", donationId);
      await updateDoc(donationRef, { status: "picked_up" });
      setLiveDonations(prev => prev.filter(d => d.id !== donationId));
    } catch (err) {
      alert("Failed to mark as picked up: " + err.message);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 animate-pulse flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-emerald-50 to-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto w-full space-y-8 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/70 backdrop-blur-md rounded-xl p-5 shadow-md border border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700 flex items-center gap-2">
              <CircleUserRound className="w-7 h-7" />
              Welcome, {userData.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              You're logged in as <strong className="uppercase">{userData.role}</strong>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Donor Actions */}
        {userData.role === "donor" && (
          <div className="bg-white/90 rounded-xl p-6 shadow border border-gray-100 text-center space-y-4">
            <p className="text-gray-800 text-lg">
              You’ve made <strong>{liveDonations.length + pickedUpDonations.length}</strong> donation
              {liveDonations.length + pickedUpDonations.length !== 1 && "s"}.
            </p>
            {getBadge(liveDonations.length + pickedUpDonations.length) && (
              <p className="text-amber-600 font-semibold text-sm">
                🎖 You’ve earned a {getBadge(liveDonations.length + pickedUpDonations.length)} Badge!
              </p>
            )}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate("/donate")}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 transition text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4" />
                Donate Food
              </button>
              <button
                onClick={() => navigate("/my-donations")}
                className="flex items-center justify-center gap-2 bg-white border border-emerald-600 text-emerald-700 px-5 py-2 rounded-md hover:bg-emerald-50 transition text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                My Donations
              </button>
            </div>
          </div>
        )}

        {/* NGO Info */}
        {userData.role === "ngo" && (
          <div className="bg-white/90 rounded-xl p-6 shadow border border-gray-100 text-center space-y-2">
            <p className="text-gray-800 text-lg flex justify-center items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              Active in Pincode: <strong>{userData.pincode}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Below are active donations in your area or those you've claimed.
            </p>
          </div>
        )}

        {/* Live Donations */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          </div>
        ) : liveDonations.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <PackageOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No live donations found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveDonations.map((d) => (
              <div key={d.id} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="bg-gray-50 h-48 flex items-center justify-center">
                  <img src={d.imageUrl} alt={d.title} className="max-h-48 w-full object-contain" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold mb-1">{d.title}</h2>
                  <p className="text-sm text-gray-600">Qty: {d.quantity}</p>
                  <p className="text-sm text-gray-600">Condition: {d.condition}</p>
                  <p className="text-sm text-gray-500 mt-2 flex-1">{d.description}</p>
                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${d.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                      {d.status.toUpperCase()}
                    </span>
                  </div>

                  {userData.role === "ngo" && d.status === "pending" && (
                    <button onClick={() => navigate(`/claim/${d.id}`)} className="mt-3 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition">
                      Claim Donation
                    </button>
                  )}

                  {userData.role === "ngo" && d.status === "claimed" && (
                    <button onClick={() => handleMarkPickedUp(d.id)} className="mt-3 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition">
                      Mark as Picked Up
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Picked Up Donations */}
        {pickedUpDonations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4">
              {userData.role === "ngo" ? "Claimed & Picked Up Donations" : "Picked Up Donations"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pickedUpDonations.map((d) => (
                <div key={d.id} className="bg-white border rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold mb-1">{d.title}</h3>
                  <p className="text-sm text-gray-600">Qty: {d.quantity}</p>
                  <p className="text-sm text-gray-600">Condition: {d.condition}</p>
                  <p className="text-xs text-gray-400 mt-1">Picked up</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center text-sm text-gray-500 border-t pt-6">
        © {new Date().getFullYear()} FoodBridge. Built with ❤️ for the community.
      </footer>
    </div>
  );
}
