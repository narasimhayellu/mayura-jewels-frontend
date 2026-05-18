import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [shippingRules, setShippingRules] = useState([]);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("https://mayura-jewels-backend.onrender.com/api/backend/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/backend/cart",
        {
          product_id: product._id || product.id,
          product_name: product.name,
          price: product.price,
          thumb_image: product.thumb_image,
          quantity,
          product_sku: product.sku,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        await fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.log("Error:", error.response?.data);
    }
  };

  const updateQuantity = async (id, type) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const currentItem = cartItems.find((item) => (item._id || item.id) === id);
    if (!currentItem) return;

    const newQty =
      type === "inc" ? currentItem.quantity + 1 : currentItem.quantity - 1;

    if (newQty < 1) return;

    try {
      const response = await axios.put(
        `https://mayura-jewels-backend.onrender.com/api/backend/cart/${id}`,
        {
          quantity: newQty,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCartItems((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id ? { ...item, quantity: newQty } : item,
        ),
      );
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log("Error:", error.response?.data);
    }
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.delete(
        `https://mayura-jewels-backend.onrender.com/api/backend/cart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200 || response.status === 204) {
        setCartItems((prev) =>
          prev.filter((item) => (item._id || item.id) !== id),
        );
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.log("Error:", error.response?.data);
    }
  };

  const fetchShippingRules = async () => {
    try {
      const res = await axios.get(
        "https://mayura-jewels-backend.onrender.com/api/frontend/shipping-rules",
      );
      setShippingRules(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchShippingRules();
  }, []);

  const selectedShipping = shippingRules.find((r) => r.id === shippingMethod);

  const shippingCost = parseFloat(selectedShipping?.cost || 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0,
  );
  const tax = 0;
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    if (shippingRules.length === 0) return;

    const express = shippingRules.find(
      (r) => r.type === "min_cost" && subtotal >= parseFloat(r.min_cost),
    );

    if (express) {
      setShippingMethod(express.id);
    } else {
      const standard = shippingRules.find((r) => r.type === "flat_cost");
      setShippingMethod(standard?.id);
    }
  }, [subtotal, shippingRules]);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        "https://mayura-jewels-backend.onrender.com/api/backend/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const placeOrder = async (selectedAddress, paymentMethod = "cod") => {
    const token = localStorage.getItem("token");

    if (!token || !selectedAddress) return;

    try {
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

      const totalQty = orderItems.reduce(
        (sum, item) => sum + Number(item.quantity || item.qty || 0),
        0,
      );

      const payload = {
        products: orderItems
          .filter(
            (item) => item.product_id || item.product?._id || item.product?.id,
          )
          .map((item) => ({
            product_id:
              item.product_id?._id ||
              item.product_id ||
              item.product?._id ||
              item.product?.id ||
              null,

            product_name: item.product_name || item.product?.name || item.name,

            thumb_image: item.thumb_image,

            sku: item.product_sku || item.sku || item.product?.sku || "",

            unit_price: Number(item.price || item.unit_price || 0),

            qty: Number(item.quantity || item.qty || 1),
          })),

        order_address: {
          name: selectedAddress.name,
          email: selectedAddress.email,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state_id: selectedAddress.state_id,
          country_id: selectedAddress.country_id,
          zip: selectedAddress.zip,
          country: "India",
        },
        sub_total: Number(orderSubtotal),
        shipping_cost: Number(shippingCost),
        tax: Number(tax),
        amount: Number(orderTotal),
        product_qty: Number(totalQty),
        payment_method: paymentMethod,
      };
      console.log(payload);

      const response = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/backend/orders",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        await axios.delete("https://mayura-jewels-backend.onrender.com/api/backend/cart/clear/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems([]);
        setCheckoutItems([]);

        await fetchCart();
        await fetchOrder();

        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/checkout/complete", {
          state: {
            invoice: response.data.order,
          },
        });
      }
    } catch (error) {
      console.log("Order Error:", error.response?.data || error.message);
    }
  };

  const razorpayOrder = async (selectedAddress) => {
    const token = localStorage.getItem("token");
    if (!token || !selectedAddress) return;

    try {
      const orderItems = checkoutItems.length > 0 ? checkoutItems : cartItems;
      const subtotalCalc = orderItems.reduce(
        (acc, item) =>
          acc +
          Number(item.price || item.unit_price || 0) *
            Number(item.quantity || item.qty || 1),
        0,
      );

      const shipping = Number(shippingCost || 0);
      const taxValue = Number(tax || 0);

      const finalAmount = subtotalCalc + shipping + taxValue;

      const totalQty = orderItems.reduce(
        (sum, item) => sum + Number(item.quantity || item.qty || 0),
        0,
      );

      const orderAddress = {
        name: selectedAddress.name || "",
        phone: selectedAddress.phone || "",
        address: selectedAddress.address || "",
        city: selectedAddress.city || "",
        state_id: selectedAddress.state_id || "",
        country_id: selectedAddress.country_id || "",
        zip: selectedAddress.zip || "",
        email: selectedAddress.email || "",
        country: "India",
      };

      const payload = {
        sub_total: Number(subtotalCalc),
  amount: Number(finalAmount),
        product_qty: Number(totalQty),
        order_address: orderAddress,
        shipping_method: [shippingMethod],
        products: orderItems.map((item) => ({
          product_id:
            item.product_id ||
            item.product?._id ||
            item.product?.id ||
            item._id ||
            item.id ||
            null,
          vendor_id: item.vendor_id || item.product?.vendor_id || null,
          product_name:
            item.product_name || item.product?.name || item.name || "",
          thumb_image: item.thumb_image || item.product?.thumb_image || "",

          sku: item.product_sku || item.sku || item.product?.sku || "",
          unit_price: Number(item.price || item.unit_price || 0),
          qty: Number(item.quantity || item.qty || 1),
        })),
      };

      const orderResponse = await axios.post(
        "https://mayura-jewels-backend.onrender.com/api/backend/payments/razorpay",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const localOrderId = orderResponse.data.local_order_id;

      window.__rzpOrderId = orderResponse.data.razorpay_order_id || "";
      window.__rzpLocalOrderId = localOrderId;
      window.__rzpToken = token;

      console.log("rzpOrderId:", window.__rzpOrderId);
      console.log("localOrderId:", window.__rzpLocalOrderId);

      const options = {
        key: orderResponse.data.key,
        amount: Number(finalAmount) * 100,
        currency: "INR",
        order_id: window.__rzpOrderId,
        name: "Mayura Jewels",
        description: "Order Payment",
        prefill: {
          name: selectedAddress.name,
          email: selectedAddress.email,
          contact: selectedAddress.phone,
        },
        theme: { color: "#063352" },
        handler: async function (response) {
          console.log("Handler response:", response);
          console.log("rzpOrderId in handler:", window.__rzpOrderId);

          try {
            await axios.post(
              "https://mayura-jewels-backend.onrender.com/api/backend/payments/razorpay/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: window.__rzpOrderId,
                razorpay_signature: response.razorpay_signature,
                local_order_id: window.__rzpLocalOrderId,
              },
              {
                headers: {
                  Authorization: `Bearer ${window.__rzpToken}`,
                  "Content-Type": "application/json",
                },
              },
            );

            const ordersRes = await axios.get(
              "https://mayura-jewels-backend.onrender.com/api/backend/my-orders",
              { headers: { Authorization: `Bearer ${window.__rzpToken}` } },
            );
            const foundOrder = ordersRes.data.orders?.find(
              (o) => o.id === window.__rzpLocalOrderId,
            );

            await axios.delete(
              "https://mayura-jewels-backend.onrender.com/api/backend/cart/clear/all",
              {
                headers: {
                  Authorization: `Bearer ${window.__rzpToken}`,
                },
              },
            );

            setCartItems([]);
            setCheckoutItems([]);
            await fetchCart();
            await fetchOrder();
            window.dispatchEvent(new Event("cartUpdated"));
            delete window.__rzpOrderId;
            delete window.__rzpLocalOrderId;
            delete window.__rzpToken;

            navigate("/checkout/complete", {
              state: { invoice: foundOrder },
            });
          } catch (error) {
            console.log("Verification Error:", error.response?.data);
            alert("Payment verification failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log("Razorpay Error:", error.response?.data || error.message);
    }
  };

  const cancelOrder = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post(
        `https://mayura-jewels-backend.onrender.com/api/backend/orders/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200 || response.status === 204) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, order_status: "cancelled" } : order,
          ),
        );
      }
    } catch (error) {
      console.log("Error:", error.response?.data?.errors || error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        updateQuantity,
        removeFromCart,
        addToCart,
        shippingRules,
        shippingMethod,
        setShippingMethod,
        shippingCost,
        subtotal,
        tax,
        total,
        fetchOrder,
        placeOrder,
        razorpayOrder,
        cancelOrder,
        orders,
        checkoutItems,
        setCheckoutItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
