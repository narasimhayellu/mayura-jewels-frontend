import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const Otplogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSetOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      enqueueSnackbar("Please enter email", {
        variant: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/auth/send-otp",
        {
          email,
        },
      );

      console.log(response.data);

      setShowOtp(true);
    } catch (error) {
      console.log("Error:", error.response?.data);
      enqueueSnackbar(error.response?.data?.message || "Failed to send OTP", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      enqueueSnackbar("Please enter OTP", {
        variant: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/auth/verify-otp",
        {
          email,
          otp,
        },
      );

      const token = response.data.access_token || response.data.token;

      if (token) {
        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log("Error:", error.response?.data);

      alert(error.response?.data?.message || "OTP Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center my-30 gap-5 ">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-[#063352] animate-spin"></div>

        <h1 className="text-[#063352] text-xl font-serif animate-pulse">
          Please wait...
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-20 flex items-center justify-center ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-[#063352] text-white py-8 px-6 text-center">
          <h1 className="text-4xl font-serif tracking-wide">Mayura Jewels</h1>

          <p className="mt-2 text-md text-gray-200">Login with OTP</p>
        </div>

        <div className="p-8">
          {!showOtp ? (
            <form onSubmit={handleSetOtp} className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#063352] transition"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className="bg-[#063352] hover:bg-[#0a4c78] transition text-white py-3 rounded-lg font-semibold shadow-md">
                Send OTP
              </button>
              <h1 className="text-center font-semibold hover:underline">
                <Link to="/login">Back to Password Login</Link>
              </h1>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none bg-gray-100"
                  type="email"
                  value={email}
                  readOnly
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Enter OTP
                </label>

                <input
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#063352] tracking-[8px] text-center text-lg"
                  type="text"
                  placeholder=""
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>

              <button className="bg-[#063352] hover:bg-[#0a4c78] transition text-white py-3 rounded-lg font-semibold shadow-md">
                Verify & Login
              </button>

              <button
                type="button"
                onClick={() => setShowOtp(false)}
                className="text-[#063352] text-md cursor-pointer hover:underline"
              >
                Change Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Otplogin;
