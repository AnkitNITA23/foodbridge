import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaArrowRight,
  FaInfoCircle,
  FaUserCheck,
  FaHandsHelping,
} from "react-icons/fa";

export default function Home() {
  const location = useLocation();

  // AOS animation init
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Scroll to section if coming from Navbar
  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const testimonials = [
    {
      name: "Sneha Kapoor",
      role: "NGO Worker",
      img: "https://randomuser.me/api/portraits/women/50.jpg",
      msg: "FoodBridge helped us serve 200+ meals this month—so easy!",
    },
    {
      name: "Aditya Singh",
      role: "Restaurant Owner",
      img: "https://randomuser.me/api/portraits/men/65.jpg",
      msg: "Waste has dropped significantly since we joined FoodBridge.",
    },
    {
      name: "Meera Nair",
      role: "Home Cook",
      img: "https://randomuser.me/api/portraits/women/34.jpg",
      msg: "Family leftovers are now useful—love this platform!",
    },
    {
      name: "Rohan Verma",
      role: "Community Volunteer",
      img: "https://randomuser.me/api/portraits/men/82.jpg",
      msg: "Claiming and pickup are smooth and well coordinated.",
    },
    {
      name: "Anjali Bose",
      role: "Shelter Admin",
      img: "https://randomuser.me/api/portraits/women/24.jpg",
      msg: "FoodBridge makes logistics so much easier!",
    },
    {
      name: "Vikram Patel",
      role: "Caterer",
      img: "https://randomuser.me/api/portraits/men/11.jpg",
      msg: "No more food waste after events—this is a game-changer.",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    slidesToShow: 1,
    adaptiveHeight: true,
    arrows: false,
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="bg-white py-20">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center px-6 gap-12">
          <div className="lg:w-1/2 space-y-6" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="text-gray-800">Save </span>
              <span className="text-[#2D9C6A] animate-pulse">Food</span>
              <span className="text-gray-800">. Feed </span>
              <span className="text-[#1B7F5E] animate-pulse">People</span>
              <br />
              <span className="text-[#2D9C6A]">Join FoodBridge Today!</span>
            </h1>
            <p className="text-lg text-gray-700">
              Connect surplus meals with NGOs in real-time — reduce waste and change lives.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#about"
                className="bg-[#2D9C6A] text-white px-6 py-3 rounded-full font-semibold hover:brightness-105 transition flex items-center gap-2"
              >
                <FaInfoCircle /> Learn More
              </a>
              <a
                href="/signup"
                className="bg-white border-2 border-[#2D9C6A] text-[#2D9C6A] px-6 py-3 rounded-full font-semibold hover:bg-[#2D9C6A] hover:text-white transition flex items-center gap-2"
              >
                <FaUserCheck /> Get Started
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center" data-aos="fade-left">
            <img
              src="/src/assets/hero.svg"
              alt="Volunteers donating food"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center px-6" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-[#2D9C6A] mb-6 inline-flex items-center gap-2 justify-center">
            <FaHandsHelping className="text-[#2D9C6A] text-xl" />
            About FoodBridge
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Every day, hotels, hostels, canteens, and households throw away extra edible food
            while nearby NGOs and individuals struggle to find a meal. There has never been a centralized, real-time
            system to bridge this gap — until now.
          </p>
          <p className="text-2xl font-bold text-green-700 mt-8">
            We provide a seamless platform for instant food donation and pickup.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-[#2D9C6A] mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Sign Up",
                desc: "Join as Donor or NGO",
                img: "/signup.png",
              },
              {
                title: "Post / Browse",
                desc: "List food or view offers nearby",
                img: "/post.png",
              },
              {
                title: "Claim & Deliver",
                desc: "NGOs collect and feed the hungry",
                img: "/claim.png",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center"
                data-aos="fade-up"
                data-aos-delay={i * 200}
              >
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-20 h-20 object-contain mb-4"
                />
                <h3 className="text-xl font-semibold text-[#2D9C6A] mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2D9C6A]">
            What People Say
          </h2>
          <Slider {...sliderSettings}>
            {testimonials.map((t, i) => (
              <div key={i} className="px-4">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-xl mx-auto text-center">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-[#2D9C6A]"
                  />
                  <p className="italic text-gray-700 mb-3">“{t.msg}”</p>
                  <p className="font-semibold text-[#2D9C6A]">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#2D9C6A] text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Impact Lives?</h2>
          <p className="text-lg mb-6">
            Join FoodBridge today and turn surplus into sustenance.
          </p>
          <a
            href="/signup"
            className="bg-white text-[#2D9C6A] px-8 py-4 rounded-full font-bold hover:brightness-105 transition inline-flex items-center gap-2"
          >
            <FaArrowRight /> Get Started
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
