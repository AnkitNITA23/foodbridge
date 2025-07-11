import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Loader,
  ImageIcon,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

export default function DonationForm() {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [condition, setCondition] = useState("Fresh");
  const [description, setDescription] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [donorName, setDonorName] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setPinCode(data.pincode);
          setDonorName(data.name);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [user]);

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ernecxpd");
    formData.append("folder", "foodbridge");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dpkly8aax/image/upload",
        formData
      );
      setImageUrl(res.data.secure_url);
    } catch (err) {
      alert("Image upload failed.");
      console.error("Cloudinary error:", err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl || !title || !quantity || !description) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const donationData = {
      donorId: user.uid,
      title,
      quantity,
      condition,
      description,
      imageUrl,
      pincode: pinCode,
      status: "pending",
      claimedBy: null,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "donations"), donationData);
      await sendNGOAlerts(pinCode, title, donorName);
      navigate("/dashboard");
    } catch (err) {
      alert("Error submitting donation: " + err.message);
      console.error("Firestore error:", err);
    }
  };

  const sendNGOAlerts = async (pincode, foodTitle, donorName) => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "ngo"),
        where("pincode", "==", pincode)
      );
      const snapshot = await getDocs(q);
      const ngos = snapshot.docs.map((doc) => doc.data());

      for (const ngo of ngos) {
        const form = document.createElement("form");
        form.action = "https://usebasin.com/f/0e7049743ea7";
        form.method = "POST";
        form.style.display = "none";

        const fields = {
          ngo_email: ngo.email,
          subject: "🍱 New Food Donation Available Near You!",
          message: `Hello ${ngo.name || "NGO"},\n\nA new donation has been posted in your area (${pincode}) by donor ${donorName}.\n\n🧾 Title: ${foodTitle}\n📍 Pincode: ${pincode}\n\nPlease login to FoodBridge to claim it:\nhttps://foodbridge-theta.vercel.app/`
        };

        for (const key in fields) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = fields[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    } catch (err) {
      console.error("Basin error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl border border-emerald-200 p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-2xl space-y-6 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center text-emerald-700 flex items-center justify-center gap-2">
          <UploadCloud className="w-7 h-7 text-emerald-600" /> Donate Surplus Food
        </h2>

        {/* Image Upload */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Upload Image</span>
          <div className="relative border border-dashed border-emerald-300 rounded-xl p-4 flex flex-col items-center justify-center text-emerald-500 bg-emerald-50/60 hover:border-emerald-500 transition cursor-pointer">
            <ImageIcon className="w-10 h-10 mb-2" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-sm">Click to upload image</span>
          </div>
        </label>

        {uploading && (
          <p className="text-emerald-600 text-sm flex items-center gap-2">
            <Loader className="animate-spin w-4 h-4" />
            Uploading image...
          </p>
        )}

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-64 object-cover object-center rounded-xl shadow transition hover:scale-[1.02]"
          />
        )}

        {/* Fields */}
        <input
          type="text"
          placeholder="Food Title (e.g. 10 rotis)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-300 placeholder-gray-500"
          required
        />

        <input
          type="text"
          placeholder="Quantity (e.g. 5 boxes)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-300 placeholder-gray-500"
          required
        />

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-300 text-gray-700"
        >
          <option>Fresh</option>
          <option>Leftover</option>
          <option>Packaged</option>
        </select>

        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-300 placeholder-gray-500"
          rows={3}
          required
        />

        <input
          type="text"
          value={pinCode}
          disabled
          className="w-full border px-4 py-3 rounded-lg bg-gray-100 text-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" /> Submit Donation
        </button>
      </form>
    </div>
  );
}
