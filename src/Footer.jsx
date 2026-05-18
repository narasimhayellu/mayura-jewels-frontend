import { IoLocationSharp, IoCall, IoMail } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#063352] text-white py-10 px-5 mt-auto w-full">
      
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <div className="text-left">
          <h4 className="text-[20px] mb-4 uppercase border-b border-white/20 pb-2 inline-block font-semibold">
            Mayura Jewels
          </h4>

          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            Elegant jewellery collections crafted with timeless beauty and modern style.
          </p>

          <p className="text-sm mb-3">Follow Us On</p>

          <div className="flex gap-4 items-center">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:-translate-y-1 transition-all duration-300 hover:text-blue-400"
            >
              <FaFacebook size={24} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:-translate-y-1 transition-all duration-300 hover:text-pink-400"
            >
              <FaInstagram size={24} />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:-translate-y-1 transition-all duration-300 hover:text-red-400"
            >
              <FaYoutube size={28} />
            </a>
          </div>
        </div>

        <div className="text-left">
          <h4 className="text-[18px] mb-4 border-b border-white/20 pb-2 inline-block font-semibold">
            PRODUCT
          </h4>

          <div className="flex flex-col gap-4 text-sm text-gray-300">
            <Link
              to="/categories"
              className="hover:text-white transition-colors"
            >
              Categories
            </Link>

            <Link
              to="/shop"
              className="hover:text-white transition-colors"
            >
              Shop
            </Link>

            <Link
              to="/about"
              className="hover:text-white transition-colors"
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="text-left">
          <h4 className="text-[18px] mb-4 border-b border-white/20 pb-2 inline-block font-semibold">
            OUR POLICIES
          </h4>

          <div className="flex flex-col gap-4 text-sm text-gray-300">
            <p className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </p>

            <p className="hover:text-white transition-colors cursor-pointer">
              Refund Policy
            </p>

            <p className="hover:text-white transition-colors cursor-pointer">
              Terms & Conditions
            </p>

            <p className="hover:text-white transition-colors cursor-pointer">
              Shipping Policy
            </p>
          </div>
        </div>

        <div className="text-left">
          <h4 className="text-[18px] uppercase mb-4 border-b border-white/20 pb-2 inline-block font-semibold">
            Contact Us
          </h4>

          <div className="flex flex-col gap-5 text-sm text-gray-300">

            <div className="flex gap-3">
              <IoLocationSharp className="shrink-0 text-lg mt-1" />

              <span className="leading-relaxed">
                Shop No. 2, Mayura Jewels, Icchamani Sankul Opp.
                Hotel Ashwin, College Rd, Nashik, Maharashtra 422005
              </span>
            </div>

            <div className="flex items-center gap-3">
              <IoCall className="shrink-0 text-base" />

              <span>+91 8121511211</span>
            </div>

            <div className="flex items-center gap-3 break-all">
              <IoMail className="shrink-0 text-base" />

              <span>narasimhayellu99@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 mt-10 pt-5 flex flex-col md:flex-row justify-between items-center gap-3 text-gray-300 text-sm text-center">
        
        <h1>
          Copyright © 2026. All rights reserved by Mayura Jewels
        </h1>

        <h1>
          Developed by GDRB Technologies Pvt Ltd.
        </h1>
      </div>
    </footer>
  );
};

export default Footer;