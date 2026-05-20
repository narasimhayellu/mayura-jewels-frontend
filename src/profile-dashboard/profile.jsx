import React, { useState, useEffect } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    gender: "",
    subscribe: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        setLoading(true);

        const response = await axios.get(
          "https://mayura-jewels-backend.onrender.com/api/backend/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const user = response.data.data;

        setFormData({
          username: user.username || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          gender: user.gender || "",
          subscribe: user.subscribe || false,
        });
      } catch (error) {
        console.log("Error:", error);

        enqueueSnackbar("Failed to load profile", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Please login first", {
        variant: "warning",
      });

      return;
    }

    try {
      setLoading(true);

      await axios.put(
        "https://mayura-jewels-backend.onrender.com/api/backend/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      enqueueSnackbar("Profile updated successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.log(error);

      enqueueSnackbar(
        error.response?.data?.message || "Failed to update profile",
        {
          variant: "error",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[350px] sm:h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-t-4 border-b-4 border-[#063352]"></div>
      </div>
    );
  }

return (
  <div className="w-full px-3 py-3 sm:px-6 md:px-8">
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-[#063352] px-5 py-6 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          My Profile
        </h1>

        <p className="text-gray-200 text-sm sm:text-base mt-1">
          Manage your account information
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="p-4 sm:p-6 md:p-8 space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>

          <input
            required
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full h-[48px] sm:h-[52px] border border-gray-300 rounded-xl px-4 text-sm sm:text-base outline-none focus:border-[#063352] focus:ring-2 focus:ring-[#063352]/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile Number
          </label>

          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            className="w-full h-[48px] sm:h-[52px] border border-gray-300 rounded-xl px-4 text-sm sm:text-base bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full h-[48px] sm:h-[52px] border border-gray-200 rounded-xl px-4 text-sm sm:text-base bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Gender
          </label>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-4">
            {["Male", "Female", "Others"].map((option) => (
              <label
                key={option}
                className={`flex items-center justify-center gap-2 border rounded-xl py-3 px-2 cursor-pointer transition-all text-sm sm:text-base ${
                  formData.gender === option
                    ? "bg-[#063352] text-white border-[#063352]"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={formData.gender === option}
                  onChange={handleChange}
                  className="hidden"
                />

                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="subscribe"
              checked={formData.subscribe}
              onChange={handleChange}
              className="mt-1 w-4 h-4 accent-[#063352] flex-shrink-0"
            />

            <span className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Subscribe to our newsletter and receive updates
              about latest jewellery collections and offers.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[50px] sm:h-[54px] bg-[#063352] text-white rounded-xl font-bold text-sm sm:text-base hover:bg-[#0a4570] transition-all disabled:opacity-50 cursor-pointer active:scale-[0.98]"
        >
          {loading ? "Updating Profile..." : "Update Profile"}
        </button>
      </form>
    </div>
  </div>
);
};

export default Profile;