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
import { Loader2 } from "lucide-react";

export default function MyDonations() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        alert("Error fetching user data.");
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!userData) return;

    const fetchDonations = async () => {
      setLoading(true);
      try {
        let q;
        if (userData.role === "donor") {
          q = query(collection(db, "donations"), where("donorId", "==", user.uid));
        } else {
          q = query(collection(db, "donations"), where("claimedBy", "==", user.uid));
        }

        const snapshot = await getDocs(q);
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (filter !== "all") {
          data = data.filter(d => d.status === filter);
        }

        setDonations(data);
      } catch (err) {
        alert("Error fetching donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userData, filter]);

  const markAsPickedUp = async (donationId) => {
    try {
      setUpdatingId(donationId);
      await updateDoc(doc(db, "donations", donationId), {
        status: "picked_up",
      });
      setDonations(prev =>
        prev.map(d => d.id === donationId ? { ...d, status: "picked_up" } : d)
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-emerald-800">
        My Donations
      </h2>

      <div className="flex justify-center mb-6 gap-3 flex-wrap">
        {["all", "pending", "claimed", "picked_up"].map((status) => (
          <button
            key={status}
            className={`px-4 py-1 rounded-full transition font-medium text-sm ${
              filter === status
                ? "bg-emerald-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : donations.length === 0 ? (
        <p className="text-center text-gray-500">No donations found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white p-4 rounded-xl shadow border border-gray-100"
            >
              <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden rounded-md mb-3">
                <img
                  src={donation.imageUrl}
                  alt="Food"
                  className="max-h-40 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-emerald-800">
                {donation.title}
              </h3>
              <p className="text-sm text-gray-600">
                Quantity: {donation.quantity}
              </p>
              <p className="text-sm text-gray-600">
                Condition: {donation.condition}
              </p>
              <p className="text-sm text-gray-600 capitalize">
                Status:{" "}
                <span className="font-medium text-emerald-700">
                  {donation.status.replace("_", " ")}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {donation.description}
              </p>

              {userData?.role === "ngo" &&
                donation.status === "claimed" && (
                  <button
                    onClick={() => markAsPickedUp(donation.id)}
                    disabled={updatingId === donation.id}
                    className="mt-4 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
                  >
                    {updatingId === donation.id
                      ? "Marking..."
                      : "Mark as Picked Up"}
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
