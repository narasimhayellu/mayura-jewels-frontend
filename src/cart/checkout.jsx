import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutStepper from "./checkout-stepper";
import country_state_district from "@coffeebeanslabs/country_state_district";
import axios from "axios";
import { useCart } from "../cartContext";
import { enqueueSnackbar } from "notistack";

const Checkout = () => {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const {
    cartItems,
    shippingCost,
    subtotal,
    tax,
    total,
    checkoutItems,
  } = useCart();

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

  const orderItems =
    checkoutItems.length > 0 ? checkoutItems : cartItems;

  const orderSubtotal =
    checkoutItems.length > 0
      ? checkoutItems.reduce(
          (acc, item) =>
            acc +
            parseFloat(item.price || item.unit_price) *
              (item.quantity || item.qty),
          0,
        )
      : subtotal;

  const orderTotal =
    checkoutItems.length > 0
      ? orderSubtotal + parseFloat(shippingCost) + tax
      : total;

  const selectedAddress = userData.find(
    (addr) => addr._id === selectedAddressId,
  );

  const india = country_state_district
    .getAllCountries()
    .find((c) => c.name === "India");

  const statesList =
    country_state_district.getStatesByCountryId(india.id);

  const navigate = useNavigate();

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

        if (addresses && addresses.length > 0) {
          setSelectedAddressId(addresses[0]._id);

          const primary = addresses[0];

          setFormData({
            name: primary.name || "",
            email: primary.email || "",
            phone: primary.phone || "",
            country_id: primary.country_id || "",
            state_id: primary.state_id || "",
            city: primary.city || "",
            zip: primary.zip || "",
            address: primary.address || "",
          });
        }
      } catch (error) {
        console.error(
          "Profile fetch failed:",
          error.response?.data || error.message,
        );
      }
    };

    fetch();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

      if (response.status === 200 || response.status === 201) {
        const res = await axios.get(
          "https://mayura-jewels-backend.onrender.com/api/backend/user-addresses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const addresses = res.data.data || [];

        setUserData(addresses);

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

        if (addresses.length > 0) {
          setSelectedAddressId(
            addresses[addresses.length - 1]._id,
          );
        }

        enqueueSnackbar("Address saved successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      console.log("error:", error.response?.data || "");

      enqueueSnackbar("Failed to save address", {
        variant: "error",
      });
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-14">
      <div className="flex items-center gap-3 pt-6 text-sm sm:text-base flex-wrap">
        <Link
          className="no-underline text-black hover:text-[#063352]"
          to="/"
        >
          Home
        </Link>

        <span className="text-gray-400">/</span>

        <p className="text-gray-500">Checkout</p>
      </div>

      <div className="sm:my-16 lg:my-10 overflow-x-auto">
        <CheckoutStepper currentStep={2} />
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          {!showForm && (
            <div
              onClick={handleToggleForm}
              className="group bg-white border-2 border-dashed border-gray-300 rounded-2xl min-h-[180px] sm:min-h-[220px] w-full flex flex-col items-center justify-center cursor-pointer hover:border-[#063352] hover:bg-[#DEEFEF]/30 transition-all duration-300 px-4"
            >
              <div className="text-white text-2xl h-12 w-12 flex justify-center items-center bg-[#063352] rounded-full mb-4">
                +
              </div>

              <span className="font-bold text-gray-500 text-center group-hover:text-[#063352]">
                Add New Address
              </span>
            </div>
          )}

          {showForm && (
            <div
              ref={formRef}
              className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-md w-full"
            >
              <h2 className="text-[#063352] text-xl font-semibold mb-6">
                Add Address
              </h2>

              <form
                onSubmit={handleCreate}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border border-gray-200 rounded-lg p-3 mt-1 focus:ring-1 focus:ring-[#063352] outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    type="email"
                    placeholder="Enter email"
                    className="w-full border border-gray-200 rounded-lg p-3 mt-1 focus:ring-1 focus:ring-[#063352] outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="xxxxxxxxxx"
                    className="w-full border border-gray-200 rounded-lg p-3 mt-1 focus:ring-1 focus:ring-[#063352] outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Country
                  </label>

                  <select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg p-3 mt-1 bg-white focus:ring-1 focus:ring-[#063352] outline-none"
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
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>

                  <select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-3 mt-1 bg-white focus:ring-1 focus:ring-[#063352] outline-none"
                  >
                    <option value="">Select State</option>

                    {statesList.map((state) => (
                      <option
                        key={state.id}
                        value={state.id}
                      >
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="Enter city"
                    className="w-full border border-gray-200 rounded-lg p-3 mt-1 focus:ring-1 focus:ring-[#063352] outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Zipcode
                  </label>

                  <input
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="Enter zipcode"
                    className="w-full border border-gray-200 rounded-lg p-3 mt-1 focus:ring-1 focus:ring-[#063352] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Enter complete address"
                    className="w-full border border-gray-200 rounded-lg p-3 mt-1 focus:ring-1 focus:ring-[#063352] outline-none resize-none"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#063352] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0a4570] transition-colors"
                  >
                    Add Address
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full sm:w-auto bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {!showForm && userData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
              {userData.map((addr) => {
                const isSelected =
                  selectedAddressId === addr._id;

                return (
                  <div
                    key={addr._id}
                    onClick={() =>
                      setSelectedAddressId(addr._id)
                    }
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-[#063352] text-white border-[#063352]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#063352]/30"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h3
                        className={`font-bold text-lg break-words ${
                          isSelected
                            ? "text-white"
                            : "text-[#063352]"
                        }`}
                      >
                        {addr.name}
                      </h3>

                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 ${
                          isSelected
                            ? "border-white bg-white"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-[#063352]" />
                        )}
                      </div>
                    </div>

                    <div
                      className={`space-y-1 text-sm leading-relaxed ${
                        isSelected
                          ? "opacity-90"
                          : "text-gray-500"
                      }`}
                    >
                      <p>Mob: {addr.phone}</p>

                      <p className="break-words">
                        {addr.address}, {addr.city}
                      </p>

                      <p>Pin: {addr.zip}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-full xl:max-w-[420px] border border-gray-200 rounded-2xl shadow-lg bg-white p-5 sm:p-7 sticky top-24">
          <h3 className="text-xl font-serif text-[#063352] mb-6 border-b pb-3">
            Order Summary
          </h3>

          <div className="max-h-[350px] overflow-y-auto pr-2 mb-6">
            {orderItems.map((item) => (
              <div
                key={item.id || item._id}
                className="flex items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-100"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border border-gray-100 rounded-md bg-white p-1">
                  <img
                    src={`https://www.anuradhaartjewellery.com/public/${item.thumb_image}`}
                    className="w-full h-full object-cover rounded"
                    alt={item.product_name || item.name}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#063352] line-clamp-2">
                    {item.product_name || item.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Qty: {item.quantity}
                  </p>

                  <p className="text-sm font-bold text-[#063352] mt-1">
                    ₹
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-gray-700 text-sm sm:text-base">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span className="font-medium">
                ₹{orderSubtotal}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span className="font-medium">
                {parseFloat(shippingCost) === 0
                  ? "FREE"
                  : `₹${shippingCost}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>

              <span className="font-medium">
                ₹{tax}
              </span>
            </div>

            <div className="flex justify-between border-t pt-4">
              <span className="text-lg sm:text-xl font-bold text-[#063352]">
                Total
              </span>

              <span className="text-lg sm:text-xl font-bold text-[#063352]">
                ₹{orderTotal}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!selectedAddress) {
                enqueueSnackbar(
                  "Please select an address",
                  {
                    variant: "warning",
                  },
                );

                return;
              }

              navigate("/checkout/payment", {
                state: { selectedAddress },
              });
            }}
            disabled={orderItems.length === 0}
            className={`w-full mt-8 bg-[#063352] cursor-pointer rounded-xl text-white py-4 font-bold uppercase tracking-wider hover:bg-[#0a4570] transition-all shadow-md ${
              orderItems.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;