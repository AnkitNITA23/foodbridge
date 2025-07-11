import Lottie from "lottie-react";
import loader from "../assets/loader.json";

export default function Preloader() {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
      <div className="w-40 h-40">
        <Lottie animationData={loader} loop autoplay />
      </div>
    </div>
  );
}
