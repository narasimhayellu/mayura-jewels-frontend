import { useState } from "react";
import axios from "axios";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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

    setLoading(true);

    try {
      const response = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/auth/login",
        input,
      );

      const token = response.data.access_token || response.data.token;

      if (token) {
        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      navigate("/", { replace: true });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Login Failed", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center my-30 gap-5 ">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-[#063352] animate-spin"></div>

        <h1 className="text-[#063352] text-xl font-serif animate-pulse">
          Please wait...
        </h1>
      </div>
    );

  return (
    <div className=" flex items-center justify-center  px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#063352] text-white py-8 px-6 text-center">
          <h1 className="text-4xl font-serif">Mayura Jewels</h1>

          <p className="text-sm text-gray-200 mt-2">Welcome Back</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email or Mobile Number
              </label>

              <input
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#063352] transition"
                type="text"
                name="email"
                placeholder="Enter Email or Mobile Number"
                required
                value={input.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  className="w-full border border-gray-300 rounded-lg p-3 pr-14 outline-none focus:border-[#063352] transition"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
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
            </div>

            <button className="bg-[#063352] hover:bg-[#0a4c78] transition text-white py-3 rounded-lg font-semibold shadow-md">
              Sign In
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-center">
            <h1 className="text-gray-600">
              New on our platform?{" "}
              <Link
                className="text-[#885383] font-semibold hover:underline"
                to="/register"
              >
                Create Account
              </Link>
            </h1>

            <Link
              className="text-[#063352] font-semibold hover:underline"
              to="/login-otp"
            >
              Login with OTP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
