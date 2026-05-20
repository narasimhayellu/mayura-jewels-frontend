import { enqueueSnackbar } from "notistack";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import country_state_district from "@coffeebeanslabs/country_state_district";

const Address = () => {
  const [showForm, setShowForm] = useState(false);

  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country_id: "",
    state_id: "",
    city: "",
    zip: "",
    address: "",
  });

  const [userData, setUserData] = useState([]);

  const india = country_state_district
    .getAllCountries()
    .find((c) => c.name === "India");

  const statesList = country_state_district.getStatesByCountryId(india.id);

  const handleToggleForm = () => {
    setShowForm(!showForm);

    if (!showForm) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await axios.get(
          "https://mayura-jewels-backend.onrender.com/api/backend/user-addresses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const addresses = response.data.data;

        setUserData(addresses);

        console.log(response.data.data);
      } catch (error) {
        console.error(
          "Address fetch failed:",
          error.response?.data || error.message,
        );
      }
    };

    fetch();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (userData.length >= 4) {
      enqueueSnackbar("Maximum 4 addresses allowed", {
        variant: "error",
      });

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) return;

    const payload = {
      ...formData,
      country_id: Number(india.id),
      state_id: Number(formData.state_id),
    };

    try {
      const response = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/backend/user-addresses",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUserData((prev) => [...prev, response.data.data]);

      enqueueSnackbar("Address saved successfully!", {
        variant: "success",
      });

      setShowForm(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
        country_id: "",
        state_id: "",
        city: "",
        zip: "",
        address: "",
      });
    } catch (error) {
      console.log("error:", error.response?.data || "");

      enqueueSnackbar("Failed to save address", {
        variant: "error",
      });
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `https://mayura-jewels-backend.onrender.com/api/backend/user-addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUserData((prev) =>
        prev.filter((addr) => addr._id !== addressId),
      );

      enqueueSnackbar("Address deleted successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Delete failed:", error.response?.data);

      enqueueSnackbar("Failed to delete address", {
        variant: "error",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 px-4 sm:px-6">
      
      {!showForm && (
        <div className="flex justify-center">
          <div
            onClick={handleToggleForm}
            className="group border-2 border-dashed border-gray-300 rounded-2xl 
            h-[200px] sm:h-[230px] md:h-[250px] 
            w-full max-w-[400px] 
            p-4 flex flex-col items-center justify-center 
            cursor-pointer hover:border-[#063352] 
            hover:bg-[#DEEFEF]/30 transition-all duration-300"
          >
            <div className="text-[70px] sm:text-[90px] md:text-[120px] leading-none text-gray-400 group-hover:text-[#063352] transition-colors">
              +
            </div>

            <span className="font-bold text-sm sm:text-base text-gray-500 group-hover:text-[#063352] text-center">
              Add Address
            </span>
          </div>
        </div>
      )}

      {showForm && (
        <div
          ref={formRef}
          className="bg-white border border-gray-100 rounded-3xl 
          w-full max-w-4xl mx-auto
          max-h-[90vh] overflow-y-auto
          p-4 sm:p-6 md:p-8 
          shadow-md animate-fadeIn transition-all"
        >
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#063352]">
              Add Address
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Fill your delivery details below
            </p>
          </div>

          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
          >
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                type="text"
                placeholder="Enter your name"
                className="w-full h-[50px] border border-gray-300 rounded-xl px-4 mt-2 focus:ring-2 focus:ring-[#063352]/20 focus:border-[#063352] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                placeholder="Enter email"
                className="w-full h-[50px] border border-gray-300 rounded-xl px-4 mt-2 focus:ring-2 focus:ring-[#063352]/20 focus:border-[#063352] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Mobile Number
              </label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                type="text"
                placeholder="xxxxxxxxxx"
                className="w-full h-[50px] border border-gray-300 rounded-xl px-4 mt-2 focus:ring-2 focus:ring-[#063352]/20 focus:border-[#063352] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Country
              </label>

              <select
                name="country_id"
                value={formData.country_id}
                onChange={handleChange}
                required
                className="w-full h-[50px] border border-gray-300 rounded-xl px-4 mt-2 bg-white focus:ring-2 focus:ring-[#063352]/20 focus:border-[#063352] outline-none"
              >
                <option value="">Select Country</option>

                {country_state_district
                  .getAllCountries()
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                State
              </label>

              <select
                name="state_id"
                value={formData.state_id}
                onChange={handleChange}
                required
                className="w-full h-[50px] border border-gray-300 rounded-xl px-4 mt-2 bg-white focus:ring-2 focus:ring-[#063352]/20 focus:border-[#063352] outline-none"
              >
                <option value="">Select State</option>

                {statesList.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                City
              </label>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                type="text"
                placeholder="Enter city"
                className="w-full h-[50px] border border-gray-300 rounded-xl px-4 mt-2 focus:ring-2 focus:ring-[#063352]/20 focus:border-[#063352] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Zipcode
              </label>

              <input
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                type="text"
                placeholder="Enter zipcode"
                className="w-full h-[50px] border border-gray-300 rounded-xl px-4 mt-2 focus:ring-2 focus:ring-[#063352]/20 focus:border-[#063352] outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Full Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter complete address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 resize-none focus:ring-2 focus:ring-[#063352]/20 focus:border-[#063352] outline-none"
              />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="bg-[#063352] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0a4570] transition-all w-full sm:w-auto"
              >
                Save Address
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && userData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
          {userData.map((addr) => (
            <div
              key={addr._id}
              className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#063352]">
                    {addr.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {addr.phone}
                  </p>
                </div>

                {addr.is_default && (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    Primary
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>{addr.address}</p>

                <p>
                  {addr.city} - {addr.zip}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <button className="text-[#063352] font-semibold hover:underline">
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(addr._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Address;