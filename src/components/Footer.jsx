import { Link } from "react-router-dom";
import { FaHandHoldingHeart } from "react-icons/fa";

// Local social icons
import facebookIcon from "../assets/social/facebook.svg";
import instagramIcon from "../assets/social/instagram.svg";
import twitterIcon from "../assets/social/twitter.svg";
import linkedinIcon from "../assets/social/linkedin.svg";

export default function Footer() {
  return (
    <footer className="bg-[#F9FAFB] text-gray-700 border-t border-gray-200 pt-12 pb-6 mt-20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Section 1: About */}
        <div>
          <h3 className="text-2xl font-semibold text-[#2D9C6A] mb-4 flex items-center gap-2">
            <FaHandHoldingHeart className="text-[#2D9C6A]" size={24} />
            FoodBridge
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">
            Bridging surplus and need — helping reduce food waste and hunger across communities. Join the cause.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-[#2D9C6A] transition">Home</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-[#2D9C6A] transition">Dashboard</Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-[#2D9C6A] transition">Donate</Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-[#2D9C6A] transition">Sign Up</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-[#2D9C6A] transition">Login</Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook">
              <img
                src={facebookIcon}
                alt="Facebook"
                className="w-6 h-6 hover:scale-110 transition-transform"
              />
            </a>
            <a href="#" aria-label="Instagram">
              <img
                src={instagramIcon}
                alt="Instagram"
                className="w-6 h-6 hover:scale-110 transition-transform"
              />
            </a>
            <a href="#" aria-label="Twitter">
              <img
                src={twitterIcon}
                alt="Twitter"
                className="w-6 h-6 hover:scale-110 transition-transform"
              />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img
                src={linkedinIcon}
                alt="LinkedIn"
                className="w-6 h-6 hover:scale-110 transition-transform"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-200 pt-4 text-center text-sm text-gray-500 px-6">
        &copy; {new Date().getFullYear()} FoodBridge. All rights reserved.
      </div>
    </footer>
  );
}
