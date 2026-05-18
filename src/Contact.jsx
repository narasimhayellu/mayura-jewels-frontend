import { useState } from "react";
import axios from "axios";
import { IoLocationSharp, IoCall, IoMail } from "react-icons/io5";
import { Link } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const Contact = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/frontend/contact-messages",
        input,
      );

      enqueueSnackbar("Message sent successfully", {
        variant: "success",
      });

      console.log(response.data);

      setInput({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Failed to send message", {
        variant: "error",
      });

      console.log("Error", error);

      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#063352]"></div>

        <p className="animate-pulse text-[#063352] font-serif text-lg sm:text-xl">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-wrap items-center gap-3 px-4 sm:px-8 lg:px-12 py-5">
        <Link
          className="no-underline text-black hover:text-[#063352] text-sm sm:text-base"
          to="/"
        >
          Home
        </Link>

        <span className="text-gray-500">/</span>

        <p className="text-gray-500 text-sm sm:text-base">Contact</p>
      </div>

      <div className="w-full">
        <img
          className="w-full h-[220px] sm:h-[320px] lg:h-[410px] object-cover"
          src="https://miro.medium.com/v2/resize:fit:1200/0*UstBcQwoOt0g_egs."
          alt="Contact Banner"
        />
      </div>

      <div className="flex justify-center my-6 sm:my-10 px-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3797.9228539576875!2d73.76722847528492!3d20.004050081401058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb9f47555141%3A0x93469437e615ec1d!2sAnuradha%20Art%20Jewellery!5e1!3m2!1sen!2sin!4v1776423809089!5m2!1sen!2sin"
          className="w-full max-w-[1200px] h-[250px] sm:h-[350px] rounded-lg border-0 shadow-md"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 sm:px-6 lg:px-5 mb-10">
        <form
          className="bg-white p-5 sm:p-8 shadow-lg rounded-lg border border-gray-100"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#063352] mb-6">
            Tell Us Your Message
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="font-semibold text-gray-700 text-sm sm:text-base"
              >
                Full Name
              </label>

              <input
                className="p-3 border border-gray-300 rounded focus:outline-[#063352] text-sm sm:text-base"
                id="name"
                type="text"
                placeholder="Enter your name"
                name="name"
                value={input.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-semibold text-gray-700 text-sm sm:text-base"
              >
                Email Address
              </label>

              <input
                className="p-3 border border-gray-300 rounded focus:outline-[#063352] text-sm sm:text-base"
                id="email"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={input.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="subject"
                className="font-semibold text-gray-700 text-sm sm:text-base"
              >
                Subject
              </label>

              <input
                className="p-3 border border-gray-300 rounded focus:outline-[#063352] text-sm sm:text-base"
                id="subject"
                type="text"
                placeholder="Enter subject"
                name="subject"
                value={input.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="message"
                className="font-semibold text-gray-700 text-sm sm:text-base"
              >
                Your Message
              </label>

              <textarea
                className="p-3 border border-gray-300 rounded h-32 resize-none focus:outline-[#063352] text-sm sm:text-base"
                id="message"
                placeholder="Type your message"
                name="message"
                value={input.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="bg-[#063352] text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-all mt-4 cursor-pointer w-full sm:w-auto px-8"
              type="submit"
            >
              Send Message
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-6 lg:gap-8 lg:mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#063352]">
            Contact Us
          </h2>

          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Premium art jewellery for every occasion. We are here to help you
            find the perfect piece for your special moments.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <IoLocationSharp className="text-2xl text-[#063352] shrink-0 mt-1" />

              <div>
                <h4 className="font-bold text-sm sm:text-base">Address</h4>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Shop No. 2, Icchamani Sankul Opp. Hotel Ashwin, College Rd,
                  Nashik, Maharashtra 422005
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IoCall className="text-2xl text-[#063352] shrink-0 mt-1" />

              <div>
                <h4 className="font-bold text-sm sm:text-base">Contact</h4>

                <p className="text-sm text-gray-600">
                  Phone: +91 81215 11211
                </p>

                <p className="text-sm text-gray-600">
                  WhatsApp: Chat on WhatsApp
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IoMail className="text-2xl text-[#063352] shrink-0 mt-1" />

              <div>
                <h4 className="font-bold text-sm sm:text-base">Email</h4>

                <p className="text-sm text-gray-600 break-all">
                  narasimhayellu99@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;