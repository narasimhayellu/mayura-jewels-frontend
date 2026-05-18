import CheckoutStepper from "./checkout-stepper";
import { useCart } from "../cartContext";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const {
    cartItems,
    checkoutItems,
    placeOrder,
    shippingCost,
    subtotal,
    tax,
    total,
    razorpayOrder,
  } = useCart();

  const location = useLocation();

  const selectedAddress = location.state?.selectedAddress;

  const orderItems = checkoutItems.length > 0 ? checkoutItems : cartItems;

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

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to place order");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    if (paymentMethod === "cod") {
      placeOrder(selectedAddress, "cod");
      return;
    }

    if (paymentMethod === "online") {
      razorpayOrder(selectedAddress);
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
      
              <p className="text-gray-500">Payment</p>
            </div>

      <div className="sm:my-16 px-16 lg:my-10 overflow-x-auto">
        <CheckoutStepper currentStep={3} />
      </div>

      <div className="flex flex-col xl:flex-row gap-8 justify-center ">
        <div className="w-full max-w-2xl flex flex-col gap-4 order-2 xl:order-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#063352]">
            Payment Method
          </h1>

          <label
            className={`flex items-center justify-between p-4 sm:p-5 border rounded-xl transition-all cursor-pointer ${
              paymentMethod === "online"
                ? "bg-[#DEEFEF]/20 border-[#063352] ring-1 ring-[#063352]"
                : "bg-white border-gray-200 hover:border-[#063352]/40"
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
                className="accent-[#063352] w-4 h-4"
              />

              <div className="flex flex-col">
                <span className="text-[#063352] font-semibold text-sm sm:text-base">
                  Razorpay
                </span>

                <span className="text-xs sm:text-sm text-gray-500">
                  Pay securely using UPI, Card, Net Banking
                </span>
              </div>
            </div>
          </label>

          <label
            className={`flex items-center justify-between p-4 sm:p-5 border rounded-xl transition-all cursor-pointer ${
              paymentMethod === "cod"
                ? "bg-[#DEEFEF]/20 border-[#063352] ring-1 ring-[#063352]"
                : "bg-white border-gray-200 hover:border-[#063352]/40"
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="accent-[#063352] w-4 h-4"
              />

              <div className="flex flex-col">
                <span className="text-[#063352] font-semibold text-sm sm:text-base">
                  Cash on Delivery
                </span>

                <span className="text-xs sm:text-sm text-gray-500">
                  Pay when your order arrives
                </span>
              </div>
            </div>
          </label>
        </div>

        <div className="w-full max-w-[500px] border border-gray-200 rounded-2xl shadow-lg bg-white p-5 sm:p-7 lg:p-8 order-1 xl:order-2">
          <h3 className="text-lg sm:text-xl font-bold text-[#063352] mb-6 tracking-wide border-b border-gray-200 pb-3">
            Order Summary
          </h3>

          <div className="max-h-[320px] overflow-y-auto mb-6 pr-1 sm:pr-2 custom-scrollbar">
            {orderItems.map((item) => (
              <div
                key={item.id || item._id}
                className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border border-gray-100 rounded-lg bg-white p-1">
                  <img
                    src={`https://www.anuradhaartjewellery.com/public/${item.thumb_image}`}
                    className="w-full h-full object-cover rounded"
                    alt={item.product_name || item.name}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-[#063352] leading-tight line-clamp-2">
                    {item.product_name || item.name}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Qty: {item.quantity || item.qty}
                  </p>

                  <p className="text-sm sm:text-base font-bold text-[#063352] mt-1">
                    ₹
                    {(
                      parseFloat(item.price || item.unit_price) *
                      (item.quantity || item.qty)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-sm sm:text-base text-gray-700 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span className="font-medium">
                ₹{orderSubtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span className="font-medium text-gray-600">
                {parseFloat(shippingCost) === 0
                  ? "FREE"
                  : `₹${shippingCost}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>

              <span className="font-medium">₹{tax}</span>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-4 mt-2">
              <span className="text-lg sm:text-2xl font-serif text-[#063352]">
                Total
              </span>

              <span className="text-lg sm:text-2xl font-bold text-[#063352]">
                ₹{orderTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={orderItems.length === 0}
            className={`w-full cursor-pointer mt-8 bg-[#063352] rounded-xl text-white py-3.5 sm:py-4 font-bold text-sm sm:text-base tracking-wide hover:bg-[#0a4570] transition-all shadow-md ${
              orderItems.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;