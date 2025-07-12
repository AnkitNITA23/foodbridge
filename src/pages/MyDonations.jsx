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
import { Loader2, X } from "lucide-react";

export default function MyDonations() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setUserData(snap.data());
    }
    loadUser();
  }, [user]);

  useEffect(() => {
    if (!userData) return;
    async function loadDonations() {
      setLoading(true);
      try {
        const q = userData.role === "donor"
          ? query(collection(db, "donations"), where("donorId", "==", user.uid))
          : query(collection(db, "donations"), where("claimedBy", "==", user.uid));
        const snap = await getDocs(q);
        let arr = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (filter !== "all") arr = arr.filter(d => d.status === filter);
        setDonations(arr);
      } catch {
        alert("Error fetching donations.");
      } finally {
        setLoading(false);
      }
    }
    loadDonations();
  }, [userData, filter]);

  async function markAsPickedUp(id) {
    setUpdatingId(id);
    await updateDoc(doc(db, "donations", id), { status: "picked_up" });
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status: "picked_up" } : d));
    setUpdatingId(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-emerald-800">
        My Donations
      </h2>
      <div className="flex justify-center mb-6 gap-3 flex-wrap">
        {["all","pending","claimed","picked_up"].map(status => (
          <button
            key={status}
            className={`px-4 py-1 rounded-full font-medium text-sm transition ${
              filter===status
              ? "bg-emerald-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-emerald-600 animate-spin" /></div>
      ) : donations.length === 0 ? (
        <p className="text-center text-gray-500">No donations found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map(d => (
            <div
              key={d.id}
              className="bg-white p-4 rounded-xl shadow border cursor-pointer hover:shadow-md transition"
              onClick={() => setSelected(d)}
            >
              <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden rounded-md mb-3">
                <img src={d.imageUrl} alt="" className="max-h-40 object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-800">{d.title}</h3>
              <p className="text-sm text-gray-600">Qty: {d.quantity}</p>
              <p className="text-sm text-gray-600">Cond: {d.condition}</p>
              <p className="text-sm text-gray-600">Status: <span className="font-medium text-emerald-700">{d.status.replace("_"," ")}</span></p>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-4 relative">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
            <img src={selected.imageUrl} alt="" className="w-full h-48 object-cover rounded-md mb-4"/>
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">{selected.title}</h3>
            <p><strong>Quantity:</strong> {selected.quantity}</p>
            <p><strong>Condition:</strong> {selected.condition}</p>
            <p><strong>Description:</strong> {selected.description}</p>
            <p><strong>Status:</strong> {selected.status.replace("_"," ")}</p>
            <p><strong>Pincode:</strong> {selected.pincode}</p>
            <p className="text-sm text-gray-500 mt-2">Posted: {selected.timestamp?.toDate ? selected.timestamp.toDate().toLocaleString() : "N/A"}</p>

            {userData.role==="ngo" && selected.status==="claimed" && (
              <button
                onClick={() => { markAsPickedUp(selected.id); setSelected(null); }}
                disabled={updatingId === selected.id}
                className="mt-4 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
              >
                {updatingId === selected.id ? "Marking..." : "Mark as Picked Up"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
