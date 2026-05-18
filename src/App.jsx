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
import Wishlist from "./dashboard/Wishlist";
import Categories from "./Categories";
import About from "./about-us";
import DashboardLayout from "./dashboard/dashboard-layout";
import Profile from "./dashboard/profile";
import Address from "./dashboard/address";
import Changepassword from "./dashboard/change-password";
import Payment from "./cart/payment";
import Cart from "./cart/cart";
import CheckoutLayout from "./cart/checkout-layout";
import Orders from "./dashboard/orders";
import Complete from "./cart/complete";
import Invoice from "./dashboard/invoice";


const App = () => {
    const location = useLocation();

    const hideLayout = ["/login", "/register", "/verify-otp", "/login-otp"].includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {!hideLayout && <Header />}
            <main className="flex-grow pt-18">
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
                    <Route element={<DashboardLayout />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/wishlist" element={<Wishlist />} />
                        <Route path="/profile/change-password" element={<Changepassword />} />
                        <Route path="/profile/address" element={<Address />} />
                        <Route path="/profile/orders" element={<Orders />} />
                    </Route>
                     <Route path="/invoice/:invoice_id" element={<Invoice />} />
                    <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />

                </Routes>
            </main>
            {!hideLayout && <Footer />}
        </div>
    )
}

export default App;