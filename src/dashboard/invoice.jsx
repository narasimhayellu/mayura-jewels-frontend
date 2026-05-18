import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Invoice = () => {
  const { invoice_id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await axios.get(
          `https://mayura-jewels-backend.onrender.com/api/backend/my-orders/${invoice_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Invoice data:", response.data);

        setInvoice(response.data.order || response.data.data || response.data);

        setLoading(false);
      } catch (error) {
        console.error("Invoice error:", error.response?.data || error.message);

        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoice_id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#063352]"></div>

        <p className="text-[#063352] font-serif text-lg md:text-xl animate-pulse text-center">
          Loading invoice...
        </p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-10 md:p-20 text-center">
        <p className="text-gray-500 text-sm md:text-base">Invoice not found.</p>

        <button
          onClick={() => navigate("/profile/orders")}
          className="mt-4 text-blue-500 underline"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
        @media print {

          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          #invoice,
          #invoice * {
            visibility: visible;
          }

          #invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 20px !important;
            margin: 0 !important;
          }

          .invoice-header {
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  width: 100% !important;
  gap: 40px !important;
}

.invoice-header > div:first-child {
  width: 60% !important;
}

.invoice-header > div:last-child {
  width: 35% !important;
  text-align: right !important;
}

          .bill-ship-section {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            gap: 40px !important;
          }

          .bill-ship-section > div {
            width: 50% !important;
          }

          .from-section {
            text-align: right !important;
            margin-left: auto !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          table {
            width: 100% !important;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 10px !important;
            font-size: 12px !important;
          }
        }
      `}
      </style>

      <div className="max-w-6xl mx-auto p-3 sm:p-5 md:p-10">
        <div
          id="invoice"
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8"
        >
          <div className="invoice-header flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-8 border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#063352]">
                Mayura Jewels
              </h1>

              <div className="flex flex-col mt-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
                  INVOICE
                </h2>

                <p className="text-sm mt-2 break-all">
                  <span className="font-semibold">Invoice ID:</span>{" "}
                  {invoice.invoice_id}
                </p>

                <p className="text-sm mt-1 capitalize">
                  <span className="font-semibold">Status:</span>{" "}
                  {invoice.order_status}
                </p>

                <p className="text-sm mt-1">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(invoice.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            <div className="text-left md:text-right from-section">
              <h3 className="text-sm font-bold text-[#063352] mb-3 uppercase">
                From:
              </h3>

              <div className="text-sm text-gray-600 space-y-1 flex flex-col gap-1">
                <p className="font-semibold text-gray-800">Mayura Jewels</p>

                <p>123 Business Street, Hyderabad</p>

                <p className="break-all">support@mayura.com</p>

                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="bill-ship-section flex flex-col md:flex-row justify-between gap-8 md:gap-10 mb-10">
            <div className="flex-1  rounded-xl p-4">
              <h3 className="text-xl md:text-[24px] font-bold text-[#063352] mb-3">
                Bill To:
              </h3>

              <div className="text-sm text-gray-600 space-y-1 break-words">
                <p>{invoice.order_address?.name || "-"}</p>

                <p>{invoice.order_address?.address || "-"}</p>

                <p>
                  {invoice.order_address?.city || "-"},{" "}
                  {invoice.order_address?.zip || "-"}
                </p>

                <p className="break-all">
                  {invoice.order_address?.email || "-"}
                </p>

                <p>{invoice.order_address?.phone || "-"}</p>
              </div>
            </div>

            <div className="flex-1  rounded-xl p-4">
              <h3 className="text-xl md:text-[24px] font-bold text-[#063352] mb-3">
                Ship To:
              </h3>

              <div className="text-sm text-gray-600 space-y-1 break-words">
                <p>{invoice.order_address?.name || "-"}</p>

                <p>{invoice.order_address?.address || "-"}</p>

                <p>
                  {invoice.order_address?.city || "-"},{" "}
                  {invoice.order_address?.zip || "-"}
                </p>

                <p className="break-all">
                  {invoice.order_address?.email || "-"}
                </p>

                <p>{invoice.order_address?.phone || "-"}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border-b border-gray-200">
            <table className="w-full mb-10 border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#063352] text-white">
                  <th className="text-left p-3 md:p-4 rounded-tl-xl text-xs md:text-sm">
                    PRODUCT
                  </th>

                  <th className="text-center p-3 md:p-4 text-xs md:text-sm">
                    UNIT PRICE
                  </th>

                  <th className="text-center p-3 md:p-4 text-xs md:text-sm">
                    SKU
                  </th>

                  <th className="text-center p-3 md:p-4 text-xs md:text-sm">
                    QTY
                  </th>

                  <th className="text-right p-3 md:p-4 rounded-tr-xl text-xs md:text-sm">
                    TOTAL
                  </th>
                </tr>
              </thead>

              <tbody>
                {(invoice.products || []).map((item, index) => (
                  <tr
                    key={item.product_id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-3 md:p-4">
                      <p className="font-medium text-gray-800 text-sm">
                        {item.product_name || item.product?.name}
                      </p>
                    </td>

                    <td className="text-center text-sm">
                      ₹{Number(item.unit_price).toFixed(2)}
                    </td>

                    <td className="text-center text-sm">{item.sku || "-"}</td>

                    <td className="text-center text-sm">{item.qty}</td>

                    <td className="text-right text-sm font-semibold pr-4">
                      ₹{(Number(item.unit_price) * Number(item.qty)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="w-full lg:max-w-sm space-y-3 rounded-xl p-4 md:p-5 ">
              <div className="flex text-sm gap-1">
                <span className="text-gray-600">Order Status:</span>

                <span className="font-medium capitalize">
                  {invoice.order_status}
                </span>
              </div>

              <div className="flex text-sm gap-1">
                <span className="text-gray-600">Payment Status:</span>

                <span className="font-medium capitalize">
                  {invoice.payment_status}
                </span>
              </div>
            </div>

            <div className="w-full lg:max-w-sm space-y-3 rounded-xl p-4 md:p-5 ">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>

                <span>₹{Number(invoice.sub_total).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>

                <span>
                  {Number(invoice.amount) - Number(invoice.sub_total) === 0
                    ? "FREE"
                    : `₹${(
                        Number(invoice.amount) - Number(invoice.sub_total)
                      ).toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method:</span>

                <span className="capitalize">{invoice.payment_method}</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-bold text-[#063352]">
                <span>Grand Total:</span>

                <span>₹{Number(invoice.amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              Thank you for shopping with us!
            </p>

            <p className="text-xs text-gray-400 mt-2 break-all">
              For support: support@mayura.com
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 print:hidden">
          <button
            onClick={() => navigate("/profile/orders")}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            ← Back to Orders
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 bg-[#063352] text-white rounded-lg hover:bg-[#0a4570] transition font-bold cursor-pointer"
          >
            Print / Download PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default Invoice;
