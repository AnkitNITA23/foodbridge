import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaHandHoldingHeart,
  FaHome,
  FaInfoCircle,
  FaUsers,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const scrollTo = (id) => {
    navigate("/", { state: { scrollTo: id } });
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2 text-2xl font-bold text-green-700"
        >
          <FaHandHoldingHeart size={28} />
          FoodBridge
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-1 hover:text-green-700 transition">
            <FaHome /> Home
          </button>
          <button onClick={() => scrollTo("about")} className="flex items-center gap-1 hover:text-green-700 transition">
            <FaInfoCircle /> About
          </button>
          <button onClick={() => scrollTo("testimonials")} className="flex items-center gap-1 hover:text-green-700 transition">
            <FaUsers /> Testimonials
          </button>
          <button onClick={() => navigate("/login")} className="flex items-center gap-1 hover:text-green-700 transition">
            <FaSignInAlt /> Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-1 px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition"
          >
            <FaUserPlus /> Sign Up
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-6 space-y-4 shadow-md text-gray-700">
          <button onClick={() => scrollTo("hero")} className="block w-full text-left flex items-center gap-2">
            <FaHome /> Home
          </button>
          <button onClick={() => scrollTo("about")} className="block w-full text-left flex items-center gap-2">
            <FaInfoCircle /> About
          </button>
          <button onClick={() => scrollTo("testimonials")} className="block w-full text-left flex items-center gap-2">
            <FaUsers /> Testimonials
          </button>
          <button onClick={() => { toggleMenu(); navigate("/login"); }} className="block w-full text-left flex items-center gap-2">
            <FaSignInAlt /> Login
          </button>
          <button
            onClick={() => { toggleMenu(); navigate("/signup"); }}
            className="block w-full text-left flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition"
          >
            <FaUserPlus /> Sign Up
          </button>
        </div>
      )}
    </header>
  );
}
