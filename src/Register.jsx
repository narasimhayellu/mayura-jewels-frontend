import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const Register = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.password !== input.password_confirmation) {
    enqueueSnackbar("Passwords do not match!", {
      variant: "error",
    });
    return;
  }

  if (/^(\d)\1+$/.test(input.phone_number)) {
    enqueueSnackbar("Invalid mobile number", {
      variant: "error",
    });
    return;
  }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/auth/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response.data);

      navigate("/verify-otp");
    }catch (error) {

  console.log("FULL ERROR:", error);

  console.log("BACKEND RESPONSE:", error.response);

  console.log("BACKEND DATA:", error.response?.data);
enqueueSnackbar(
  error.response?.data?.message || "Registration Failed",
  {
    variant: "error",
  }
);
} finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center my-30 gap-5">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-[#063352] animate-spin"></div>

        <h1 className="text-[#063352] text-xl font-serif animate-pulse">
          Please wait...
        </h1>
      </div>
    );

  return (
    <div className=" flex items-center justify-center px-4 py-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#063352] text-white py-8 px-6 text-center">
          <h1 className="text-4xl font-serif">Mayura Jewels</h1>
          <p className="text-sm text-gray-200 mt-2">Create Your Account</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#063352]"
              type="text"
              name="username"
              placeholder="Full Name"
              value={input.username}
              onChange={handleChange}
            />

            <input
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#063352]"
              type="email"
              name="email"
              placeholder="Email Address"
              value={input.email}
              onChange={handleChange}
            />

            <input
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#063352]"
              type="text"
              name="phone_number"
              placeholder="Mobile Number"
              value={input.phone_number}
              onChange={handleChange}
            />

            <div className="relative">
              <input
                className="w-full border border-gray-300 rounded-lg p-3 pr-14 outline-none focus:border-[#063352]"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={input.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="absolute right-4 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <LuEyeOff size={22} /> : <LuEye size={22} />}
              </button>
            </div>

            <div className="relative">
              <input
                className="w-full border border-gray-300 rounded-lg p-3 pr-14 outline-none focus:border-[#063352]"
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                placeholder="Confirm Password"
                value={input.password_confirmation}
                onChange={handleChange}
              />

              <button
                type="button"
                className="absolute right-4 top-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <LuEyeOff size={22} />
                ) : (
                  <LuEye size={22} />
                )}
              </button>
            </div>

            <button className="bg-[#063352] hover:bg-[#0a4c78] transition text-white py-3 rounded-lg font-semibold shadow-md">
              Register
            </button>
          </form>

          <div className="text-center mt-6">
            <h1 className="text-gray-600">
              Already have an account?{" "}
              <Link
                className="text-[#885383] font-semibold hover:underline"
                to="/login"
              >
                Login
              </Link>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
