import { useCart } from "../cartContext";
import { HiOutlineTrash } from "react-icons/hi";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import CheckoutStepper from "./checkout-stepper";
import { LuShoppingCart } from "react-icons/lu";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    shippingMethod,
    setShippingMethod,
    shippingRules,
    shippingCost,
    subtotal,
    tax,
    total,
    setCheckoutItems,
  } = useCart();

  const navigate = useNavigate();

  const isCartEmpty = cartItems.length === 0;

  const handleProceedCheckout = () => {
    const formattedItems = cartItems.map((item) => ({
      ...item,
      quantity: item.quantity || item.qty,
      price: item.price || 0,
    }));

    setCheckoutItems(formattedItems);

    navigate("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto sm:px-5">
      <div className="flex items-center gap-3 pt-6 text-sm sm:text-base flex-wrap">
        <Link
          className="no-underline text-black hover:text-[#063352]"
          to="/"
        >
          Home
        </Link>
        <span className="text-gray-500">/</span>
        <p className="text-gray-500">Cart</p>
      </div>

      <div className=" sm:my-16 lg:my-10 overflow-x-auto">
        <CheckoutStepper currentStep={1} />
      </div>

      {isCartEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white border border-dashed border-gray-300 rounded-2xl text-center px-5">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <LuShoppingCart
              size={45}
              className="text-gray-400"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#063352]">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mt-3 mb-8 max-w-md leading-relaxed text-sm sm:text-base">
            Looks like you haven’t added anything to
            your cart yet.
          </p>

          <Link
            to="/shop"
            className="bg-[#063352] text-white px-8 sm:px-10 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-[#0a4570] transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4 lg:hidden">
            {cartItems.map((item) => (
              <div
                key={item._id || item.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <img
                    src={`https://www.anuradhaartjewellery.com/public/${item.thumb_image}`}
                    alt={item.product_name}
                    className="w-24 h-24 rounded-xl border object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#063352] leading-5">
                      {item.product_name}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      SKU: {item.product_sku}
                    </p>

                    <p className="text-lg font-bold text-[#063352] mt-3">
                      ₹ {item.price}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(
                        item._id || item.id,
                      )
                    }
                    className="self-start text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <HiOutlineTrash size={22} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <span className="px-5 py-2 font-bold">
                      {item.quantity}
                    </span>

                    <div className="flex flex-col border-l border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id || item.id,
                            "inc",
                          )
                        }
                        className="px-2 py-1 hover:bg-gray-100 border-b border-gray-200"
                      >
                        <IoChevronUp size={14} />
                      </button>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id || item.id,
                            "dec",
                          )
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <IoChevronDown size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      Total
                    </p>

                    <p className="text-lg font-bold text-[#063352]">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase text-xs font-bold tracking-widest">
                    <th className="py-5 px-8 w-20">
                      Remove
                    </th>

                    <th className="py-5 px-4 w-32">
                 
                    </th>

                    <th className="py-5 px-4 ">
                      Product
                    </th>

                    <th className="py-5 px-4 w-[140px]">
                      Unit Price
                    </th>

                    <th className="py-5 px-4 text-center">
                      Quantity
                    </th>

                    <th className="py-5 px-8 text-right">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <tr
                      key={item._id || item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-6 px-8">
                        <button
                          onClick={() =>
                            removeFromCart(
                              item._id || item.id,
                            )
                          }
                          className="text-gray-400 hover:text-red-500 cursor-pointer ms-4 transition-colors"
                        >
                          <HiOutlineTrash size={22} />
                        </button>
                      </td>

                      <td className="py-6">
                        <div className="w-24 h-24 border border-gray-100 rounded-md bg-white p-1">
                          <img
                            src={`https://www.anuradhaartjewellery.com/public/${item.thumb_image}`}
                            className="w-full h-full object-cover"
                            alt={item.product_name}
                          />
                        </div>
                      </td>

                      <td className="py-6 px-4">
                        <p className="font-serif text-[#063352] text-md font-medium">
                          {item.product_name} (
                          {item.product_sku})
                        </p>
                      </td>

                      <td className="py-6 px-6 text-gray-700">
                        ₹ {item.price}
                      </td>

                      <td className="py-6 px-4">
                        <div className="flex justify-center">
                          <div className="flex items-center border border-gray-200 rounded-md bg-white">
                            <span className="px-4 py-2 text-sm font-bold min-w-[50px] text-center">
                              {item.quantity}
                            </span>

                            <div className="flex flex-col border-l border-gray-200">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item._id ||
                                      item.id,
                                    "inc",
                                  )
                                }
                                className="px-2 py-0.5 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                              >
                                <IoChevronUp
                                  size={14}
                                />
                              </button>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item._id ||
                                      item.id,
                                    "dec",
                                  )
                                }
                                className="px-2 py-0.5 cursor-pointer hover:bg-gray-100"
                              >
                                <IoChevronDown
                                  size={14}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-6 px-8 text-right text-[#063352] font-semibold">
                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row justify-between gap-8 mb-16">
            <div className="w-full xl:max-w-[550px] bg-gray-50 p-5 sm:p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-serif text-[#063352] mb-5 tracking-wide">
                Select Shipping Method
              </h3>

              <div className="space-y-4">
                {shippingRules.map((rule) => {
                  const isEligible =
                    (rule.type === "flat_cost" &&
                      subtotal < 1000) ||
                    (rule.type === "min_cost" &&
                      subtotal >=
                        parseFloat(rule.min_cost));

                  return (
                    <label
                      key={rule.id}
                      className={`flex items-center justify-between gap-4 p-4 border rounded-xl transition-all ${
                        isEligible
                          ? "bg-white border-[#063352] cursor-pointer"
                          : "bg-gray-100 opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          disabled={!isEligible}
                          checked={
                            shippingMethod ===
                            rule.id
                          }
                          onChange={() =>
                            setShippingMethod(
                              rule.id,
                            )
                          }
                        />

                        <span className="text-sm sm:text-base">
                          {rule.name}
                        </span>
                      </div>

                      <span className="font-bold text-sm sm:text-base">
                        {parseFloat(rule.cost) === 0
                          ? "FREE"
                          : `₹${rule.cost}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="w-full xl:w-[420px] bg-white p-5 sm:p-6 border border-gray-200 rounded-2xl shadow-sm h-fit">
              <h3 className="text-lg font-serif text-[#063352] mb-6 uppercase tracking-wider border-b pb-3">
                Order Summary
              </h3>

              <div className="space-y-4 text-gray-700 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span className="font-medium">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span className="font-medium text-gray-600">
                    {parseFloat(shippingCost) ===
                    0
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

                <div className="flex justify-between border-t pt-5 mt-2">
                  <span className="text-xl font-serif font-bold text-[#063352]">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[#063352]">
                    ₹{total}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full mt-8 bg-[#063352] cursor-pointer rounded-xl text-white py-4 font-bold uppercase tracking-wider hover:bg-[#0a4570] transition-all shadow-md"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;