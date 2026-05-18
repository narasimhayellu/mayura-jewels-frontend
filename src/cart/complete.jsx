import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Download,
  ShoppingBag,
  Receipt,
  Calendar,
} from "lucide-react";

const Complete = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const invoice = location.state?.invoice || {};
  const orderAddress = invoice.order_address || {};

  const handleInvoice = () => {
    if (invoice.invoice_id) {
      navigate(`/invoice/${invoice.invoice_id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#eef5f8] px-4 sm:px-6 py-8 sm:py-10 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-[24px] sm:rounded-[30px] shadow-2xl overflow-hidden">
        <div className="bg-[#063352] text-white px-5 sm:px-8 md:px-10 py-10 sm:py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white,_transparent_40%)]"></div>

          <div className="relative z-10 flex justify-center mb-5">
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-full border border-white/20 animate-pulse">
              <CheckCircle
                size={window.innerWidth < 640 ? 60 : 85}
                className="text-green-400"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-wide mb-3 leading-tight">
            Order Placed Successfully
          </h1>

          <p className="text-gray-200 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
            Thank you for shopping with us. Your order has been confirmed
            successfully.
          </p>
        </div>

        <div className="p-5 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-gray-50">
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">
                Invoice ID
              </p>

              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-[#063352]" />

                <h2 className="text-sm sm:text-lg font-bold text-[#063352] break-all">
                  {invoice.invoice_id || "N/A"}
                </h2>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-gray-50">
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">
                Order Status
              </p>

              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#063352]" />

                <h2 className="text-sm sm:text-lg font-bold capitalize text-[#063352]">
                  {invoice.order_status || "Pending"}
                </h2>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-gray-50">
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">
                Order Date
              </p>

              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#063352]" />

                <h2 className="text-sm sm:text-lg font-semibold text-gray-700">
                  {invoice.createdAt
                    ? new Date(invoice.createdAt).toLocaleDateString("en-GB")
                    : "-"}
                </h2>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-gray-50">
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">
                Payment Method
              </p>

              <h2 className="text-sm sm:text-lg font-semibold capitalize text-gray-700">
                {invoice.payment_method || "COD"}
              </h2>
            </div>
          </div>

          {invoice.products?.length > 0 && (
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 mb-8">
              <h3 className="text-lg font-bold text-[#063352] mb-5">
                Order Items
              </h3>

              <div className="flex flex-col gap-4">
                {invoice.products.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      {item.thumb_image && (
                        <img
                          src={`https://www.anuradhaartjewellery.com/public/${item.thumb_image}`}
                          className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                          alt={item.product_name}
                        />
                      )}

                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">
                          {item.product_name || item.product?.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          SKU: {item.sku || item.product?.sku}
                        </p>

                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Qty: {item.qty} × ₹
                          {Number(item.unit_price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-[#063352] text-sm sm:text-base sm:ml-auto">
                      ₹
                      {(
                        Number(item.unit_price) * Number(item.qty)
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 mb-8 bg-[#DEEFEF]/30">
            <h3 className="text-lg font-bold text-[#063352] mb-4">
              Delivery Address
            </h3>

            <div className="text-gray-700 space-y-1 text-sm sm:text-base break-words">
              <p className="font-semibold">{orderAddress.name || "-"}</p>

              <p>{orderAddress.address || "-"}</p>

              <p>
                {orderAddress.city || "-"} - {orderAddress.zip || "-"}
              </p>

              <p>{orderAddress.phone || "-"}</p>

              <p>{orderAddress.email || "-"}</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 mb-8">
            <h3 className="text-lg font-bold text-[#063352] mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm sm:text-base text-gray-600">
              <div className="flex justify-between gap-3">
                <span>Subtotal</span>

                <span>
                  ₹{Number(invoice.sub_total || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Shipping</span>

                <span>
                  {Number(invoice.amount) - Number(invoice.sub_total) === 0
                    ? "FREE"
                    : `₹${(
                        Number(invoice.amount || 0) -
                        Number(invoice.sub_total || 0)
                      ).toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Payment Status</span>

                <span className="capitalize font-medium">
                  {invoice.payment_status || "-"}
                </span>
              </div>
            </div>

            <div className="bg-[#063352] rounded-xl p-4 sm:p-5 mt-5 text-white flex justify-between items-center gap-4">
              <span className="text-base sm:text-lg font-medium">
                Grand Total
              </span>

              <span className="text-2xl sm:text-3xl font-black">
                ₹{Number(invoice.amount || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/profile/orders")}
              className="cursor-pointer flex items-center justify-center gap-2 bg-[#063352] text-white py-3.5 sm:py-4 rounded-2xl font-bold hover:bg-[#0a4570] transition-all duration-300 shadow-lg hover:scale-[1.02]"
            >
              <Package size={20} />
              Track Order
            </button>

            <button
              onClick={handleInvoice}
              className="cursor-pointer flex items-center justify-center gap-2 border-2 border-[#063352] text-[#063352] py-3.5 sm:py-4 rounded-2xl font-bold hover:bg-[#063352] hover:text-white transition-all duration-300"
            >
              <Download size={20} />
              Download Invoice
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="cursor-pointer md:col-span-2 flex items-center justify-center gap-2 text-gray-500 font-semibold hover:text-[#063352] transition-colors mt-2 text-sm sm:text-base"
            >
              <ShoppingBag size={18} />
              Continue Shopping
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complete;