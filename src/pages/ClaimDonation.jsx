import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ClaimDonation() {
  const { id } = useParams();
  const { user } = useAuth();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const docRef = doc(db, "donations", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setDonation({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        alert("Failed to fetch donation: " + err.message);
      }
    };
    fetchDonation();
  }, [id]);

  const handleClaim = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "donations", id), {
        status: "claimed",
        claimedBy: user.uid,
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Error claiming: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!donation) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-emerald-50 via-green-100 to-white">
        <p className="text-lg text-gray-600 animate-pulse flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading donation details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-emerald-50 via-green-100 to-white p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-emerald-100 p-6 sm:p-8 space-y-5">
        <img
          src={donation.imageUrl}
          className="w-full h-60 object-contain rounded-lg border border-gray-200 bg-white"
          alt={donation.title}
        />
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700">{donation.title}</h2>
        
        <div className="space-y-2 text-gray-700 text-sm sm:text-base">
          <p>
            <span className="font-semibold text-gray-600">Quantity:</span> {donation.quantity}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Condition:</span> {donation.condition}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Description:</span> {donation.description}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                donation.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {donation.status.toUpperCase()}
            </span>
          </p>
        </div>

        {donation.status === "pending" ? (
          <button
            onClick={handleClaim}
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md text-white font-medium transition ${
              loading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Claiming..." : "Claim Donation"}
          </button>
        ) : (
          <p className="text-center text-emerald-600 font-semibold mt-4">
            ✅ This donation has already been claimed.
          </p>
        )}
      </div>
    </div>
  );
}
