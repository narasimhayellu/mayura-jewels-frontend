import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Verifyotp = () => {
  const [input, setInput] = useState({
    email: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.email) {
      enqueueSnackbar("Please enter email or phone number", {
        variant: "warning",
      });
      return;
    }
    if (!input.otp) {
      enqueueSnackbar("Please enter the otp", {
        variant: "warning",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/auth/verify-otp",
        {
          email: input.email,
          otp: input.otp,
        },
      );
      const token = response.data.access_token || response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      console.log("Success:", response.data);
      navigate("/");
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Verification failed. Please try again.",
        {
          variant: "error",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col pb-20 justify-center items-center h-screen gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#063352]"></div>
        <p className="animate-pulse text-xl text-[#063352] font-serif">
          Loading...
        </p>
      </div>
    );
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-[#fcfbf9] justify-center border border-gray-200 shadow-md p-10 max-w-md mx-auto mt-20  "
    >
      <h1 className="text-center  text-[35px] text-[#443e03]">Mayura Jewels</h1>
      <h1 className="text-center  text-[20px]">Login with OTP</h1>
      <div className=" m-2 flex flex-col gap-2">
        <h1 className="text-[15px]">Enter email or phone number :</h1>
        <input
          className="border w-full p-2 rounded-[5px] border-gray-200"
          type="text"
          placeholder="Email or Phone Number"
          value={input.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
        />
        <input
          className="border w-full p-2 rounded-[5px] border-gray-200"
          placeholder="Enter OTP"
          type="text"
          value={input.otp}
          onChange={(e) => setInput({ ...input, otp: e.target.value })}
        />
      </div>
      <button className="bg-[#063352] text-white w-full py-2 rounded cursor-pointer hover:bg-[#0a4570] transition-colors mt-2">
        Verify and Login
      </button>
    </form>
  );
};
export default Verifyotp;
