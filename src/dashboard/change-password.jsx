import React, { useState } from "react";
import { LuEye, LuEyeOff, LuLock } from "react-icons/lu";
import { enqueueSnackbar } from "notistack";
import axios from "axios";

const Changepassword = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.new_password !==
      formData.new_password_confirmation
    ) {
      enqueueSnackbar("New passwords do not match!", {
        variant: "error",
      });

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Please login first", {
        variant: "warning",
      });

      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://mayura-jewels.netlify.app/api/backend/change-password",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      enqueueSnackbar("Password updated successfully!", {
        variant: "success",
      });

      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to update password",
        {
          variant: "error",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-[52px] border border-gray-300 rounded-xl px-4 pr-12 mt-2 outline-none transition-all focus:ring-2 focus:ring-[#063352]/20 focus:border-[#063352]";

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-3xl shadow-sm p-4 sm:p-6 md:p-8">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#063352]/10 p-3 rounded-xl">
          <LuLock
            size={24}
            className="text-[#063352]"
          />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#063352]">
            Change Password
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Keep your account secure by updating your password
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Current Password
          </label>

          <div className="relative">
            <input
              required
              name="current_password"
              type={
                showPasswords.current
                  ? "text"
                  : "password"
              }
              placeholder="Enter current password"
              value={formData.current_password}
              onChange={handleChange}
              className={inputClass}
            />

            <button
              type="button"
              onClick={() =>
                toggleVisibility("current")
              }
              className="absolute right-4 top-[58%] -translate-y-1/2 text-gray-400 hover:text-[#063352] transition-colors cursor-pointer"
            >
              {showPasswords.current ? (
                <LuEyeOff size={20} />
              ) : (
                <LuEye size={20} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            New Password
          </label>

          <div className="relative">
            <input
              required
              name="new_password"
              type={
                showPasswords.new
                  ? "text"
                  : "password"
              }
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleChange}
              className={inputClass}
            />

            <button
              type="button"
              onClick={() =>
                toggleVisibility("new")
              }
              className="absolute right-4 top-[58%] -translate-y-1/2 text-gray-400 hover:text-[#063352] transition-colors cursor-pointer"
            >
              {showPasswords.new ? (
                <LuEyeOff size={20} />
              ) : (
                <LuEye size={20} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Confirm New Password
          </label>

          <div className="relative">
            <input
              required
              name="new_password_confirmation"
              type={
                showPasswords.confirm
                  ? "text"
                  : "password"
              }
              placeholder="Confirm new password"
              value={
                formData.new_password_confirmation
              }
              onChange={handleChange}
              className={inputClass}
            />

            <button
              type="button"
              onClick={() =>
                toggleVisibility("confirm")
              }
              className="absolute right-4 top-[58%] -translate-y-1/2 text-gray-400 hover:text-[#063352] transition-colors cursor-pointer"
            >
              {showPasswords.confirm ? (
                <LuEyeOff size={20} />
              ) : (
                <LuEye size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#063352] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0a4570] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Changepassword;