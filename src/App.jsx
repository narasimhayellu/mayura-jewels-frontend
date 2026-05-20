import { Routes, Route, useLocation } from "react-router-dom";
import Contact from "./Contact";
import Home from "./Home";
import Header from "./Header";
import Footer from "./Footer";
import Checkout from "./cart/checkout";
import Shop from "./Shop";
import Productdetails from "./product-details";
import Register from "./Register";
import Login from "./login";
import Verifyotp from "./verify-otp";
import Otplogin from "./otp-login";
import Wishlist from "./profile-dashboard/Wishlist";
import Categories from "./Categories";
import About from "./about-us";
import Profile from "./profile-dashboard/profile";
import Address from "./profile-dashboard/address";
import Changepassword from "./profile-dashboard/change-password";
import Payment from "./cart/payment";
import Cart from "./cart/cart";
import CheckoutLayout from "./cart/checkout-layout";
import Orders from "./profile-dashboard/orders";
import Complete from "./cart/complete";
import Invoice from "./profile-dashboard/invoice";
import Dashboard from "./admin-dashboard/dashboard";
import ProfileLayout from "./profile-dashboard/profile-layout";
import DashboardLayout from "./admin-dashboard/dashboard-layout";

const App = () => {
  const location = useLocation();

  const hideLayout = [
    "/login",
    "/register",
    "/verify-otp",
    "/login-otp",
    "/admin/dashboard",
  ].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
      <main   className={`flex-grow ${
    location.pathname.startsWith("/admin") ? "" : "pt-18"
  }`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:slug" element={<Productdetails />} />
          <Route path="/checkout/payment" element={<Payment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<Verifyotp />} />
          <Route path="/login-otp" element={<Otplogin />} />
          <Route element={<CheckoutLayout />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/payment" element={<Payment />} />
            <Route path="/checkout/complete" element={<Complete />} />
          </Route>
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/wishlist" element={<Wishlist />} />
            <Route
              path="/profile/change-password"
              element={<Changepassword />}
            />
            <Route path="/profile/address" element={<Address />} />
            <Route path="/profile/orders" element={<Orders />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            {/* <Route path="/admin/profile" element={}/>
                     <Route path="/admin/change-password" element={}/>
                     <Route path="/admin/sliders" element={}/>
                     <Route path="/admin/customer-management" element={}/>
                     <Route path="/admin/contact-us" element={}/>
                     <Route path="/admin/shipping-rule" element={}/>
                     <Route path="/admin/transactions" element={}/>  */}
          </Route>
          <Route path="/invoice/:invoice_id" element={<Invoice />} />
          {/* <Route path="/admin/login" element={<Adminlogin/>}/> */}

          <Route
            path="*"
            element={
              <div className="p-20 text-center">404 - Page Not Found</div>
            }
          />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
