import React, { useState, useEffect } from "react";
import { useCart } from "../cartContext";
import {
  FileDown,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Ban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const {
    orders = [],
    cancelOrder,
    fetchOrder,
    setCheckoutItems,
    addToCart,
  } = useCart();

  const [cancelModal, setCancelModal] = useState({
    show: false,
    id: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (fetchOrder) {
      fetchOrder();
    }
  }, [fetchOrder]);

  const confirmCancel = () => {
    cancelOrder(cancelModal.id);

    setCancelModal({
      show: false,
      id: null,
    });
  };

  const handleBuyAgain = async (order) => {
    try {
      const productsForCheckout = [];

      for (const item of order.products) {
        const formattedProduct = {
          product_id: item.product_id,
          product_name: item.product_name,
          thumb_image: item.thumb_image,
          sku: item.sku,
          quantity: item.qty,
          qty: item.qty,
          price: item.unit_price,
          unit_price: item.unit_price,
          name: item.product_name,
        };

        productsForCheckout.push(formattedProduct);

        await addToCart(formattedProduct, item.qty);
      }

      setCheckoutItems(productsForCheckout);

      navigate("/checkout", {
        state: {
          buyAgainItems: productsForCheckout,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-5 md:px-8 lg:px-10 py-5 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#063352]">
          My Orders
        </h1>
      </div>

      {cancelModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <div className="bg-red-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle
                size={36}
                className="text-red-500"
              />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Cancel this order?
            </h2>

            <p className="text-sm text-gray-500 mt-2 mb-6">
              Are you sure? This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmCancel}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
              >
                Yes, cancel
              </button>

              <button
                onClick={() =>
                  setCancelModal({
                    show: false,
                    id: null,
                  })
                }
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-5 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Ban
                size={40}
                className="text-gray-400"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-[#063352] mb-3">
              No Orders Yet
            </h2>

            <p className="text-sm sm:text-base text-gray-500 max-w-md mb-8 leading-relaxed">
              Looks like you haven’t placed any orders yet.
              Start shopping and your orders will appear here.
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="bg-[#063352] text-white px-7 py-3 rounded-xl font-bold hover:bg-[#0a4570] transition-all shadow-md hover:-translate-y-1 active:scale-95 text-sm sm:text-base"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const isCancelled =
              order.order_status === "cancelled";

            return (
              <div
                key={order.id}
                className={`bg-white border rounded-2xl p-4 sm:p-5 md:p-6 transition-all ${
                  isCancelled
                    ? "opacity-75"
                    : "shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
                  <div className="flex-1 space-y-4">
                    {order.products.map((item) => (
                      <div
                        key={item.product_id || item._id}
                        className="flex gap-3 sm:gap-5 py-3 border-b border-gray-100 last:border-0"
                      >
                        <img
                          src={`https://www.anuradhaartjewellery.com/public/${item.thumb_image}`}
                          alt={item.product_name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border p-1 flex-shrink-0"
                        />

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#063352] text-sm sm:text-base line-clamp-2">
                            {item.product_name}
                          </h4>

                          <p className="text-[11px] sm:text-xs text-gray-400 mt-1 uppercase break-all">
                            SKU:{" "}
                            {item.sku || item.product?.sku}
                          </p>

                          <p className="text-sm text-gray-500 mt-2">
                            Qty: {item.qty} × ₹
                            {item.unit_price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full xl:w-[280px] flex flex-col gap-4">
                    <div
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${
                        isCancelled
                          ? "bg-gray-100 text-gray-500"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {isCancelled ? (
                        <Ban size={14} />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}

                      <span className="uppercase tracking-wide">
                        {order.order_status}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between gap-3">
                        <span>Invoice</span>
                        <span className="font-medium text-right break-all">
                          {order.invoice_id}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span>Total</span>
                        <span className="font-semibold text-[#063352]">
                          ₹{order.amount}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span>Payment</span>
                        <span className="capitalize">
                          {order.payment_method}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span>Status</span>
                        <span className="capitalize">
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() =>
                          handleBuyAgain(order)
                        }
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#058743] text-white text-sm font-bold rounded-xl hover:bg-[#046c35] shadow-sm transition-all"
                      >
                        Buy Again
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                        <button
                          disabled={isCancelled}
                          onClick={() =>
                            setCancelModal({
                              show: true,
                              id: order.id,
                            })
                          }
                          className={`flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                            isCancelled
                              ? "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                              : "border border-red-200 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <XCircle size={16} />

                          {isCancelled
                            ? "Order Cancelled"
                            : "Cancel Order"}
                        </button>

                        <button
                          onClick={() => {
                            if (order.invoice_id) {
                              navigate(
                                `/invoice/${order.invoice_id}`,
                              );
                            }
                          }}
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#063352] text-white text-sm font-bold rounded-xl hover:bg-[#0a4570] shadow-sm transition-all"
                        >
                          <FileDown size={16} />
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;