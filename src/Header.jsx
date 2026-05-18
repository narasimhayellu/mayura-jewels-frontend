import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { LuShoppingCart, LuUser } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./cartContext";

const Header = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { cartItems } = useCart();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "https://www.anuradhaartjewellery.com/api/frontend/products",
        );

        setProducts(res.data.products?.data || []);
        setCategories(res.data.categories || []);
      } catch (error) {
        console.log("Error:", error.response?.data);
      }
    };

    fetch();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlistCount(0);
      return;
    }

    try {
      const response = await axios.get(
        "https://mayura-jewels-backend.onrender.com/api/backend/wishlists",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const items =
        response.data?.data || response.data?.wishlists || response.data || [];

      setWishlistCount(items.length);
    } catch (error) {
      console.log("Wishlist error:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();

    window.addEventListener("wishlistUpdated", fetchWishlist);

    return () =>
      window.removeEventListener("wishlistUpdated", fetchWishlist);
  }, []);

  const categoryMatches = categories.filter(
    (c) => !query || c.name?.toLowerCase().includes(query.toLowerCase()),
  );

  const productMatches = products
    .filter(
      (p) => !query || p.name?.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 10);

  const hasSuggestions =
    categoryMatches.length > 0 || productMatches.length > 0;

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setQuery("");
      setMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-[15px] lg:text-[16px] text-[#063352] transition-all duration-200 uppercase font-medium ${
      isActive
        ? "underline underline-offset-8"
        : "hover:opacity-70"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4">
        
        <Link
          to="/"
          className="text-[22px] sm:text-[28px] lg:text-[30px] text-[#063352] uppercase font-mono"
        >
          Mayura Jewels
        </Link>

        <div className="hidden lg:flex relative items-center w-[400px] xl:w-[500px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search jewelry, earrings, necklaces..."
            className="border border-gray-300 rounded-lg bg-[#DEEFEF] focus:bg-white placeholder:text-[13px] py-2 px-4 pl-10 focus:outline-none focus:border-[#063352] w-full transition-colors duration-200"
          />

          <FaSearch className="absolute left-3 text-gray-400" size={14} />

          {isFocused && hasSuggestions && (
            <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg border border-gray-200 mt-1 max-h-96 overflow-y-auto z-50">
              
              {categoryMatches.length > 0 && (
                <div>
                  <div className="bg-gray-50 px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Categories
                  </div>

                  {categoryMatches.map((item, index) => (
                    <div
                      key={`cat-${index}`}
                      onMouseDown={() => {
                        navigate(`/shop?category=${item.slug || item.id}`);
                        setQuery("");
                      }}
                      className="px-6 py-3 hover:bg-[#f5f4f2] cursor-pointer text-[14px] text-[#063352] flex items-center gap-2"
                    >
                      <FaSearch size={10} className="text-gray-300" />
                      {item.name}
                    </div>
                  ))}
                </div>
              )}

              {query && productMatches.length > 0 && (
                <div>
                  <div className="bg-gray-50 px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-t border-gray-100">
                    Products
                  </div>

                  {productMatches.map((item, index) => (
                    <div
                      key={`prod-${index}`}
                      onMouseDown={() => {
                        navigate(`/product/${item.slug || item.id}`);
                        setQuery("");
                      }}
                      className="px-6 py-3 hover:bg-[#f5f4f2] cursor-pointer text-[14px] text-[#063352] flex items-center gap-2"
                    >
                      <FaSearch size={10} className="text-gray-300" />
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/categories" className={navLinkClass}>
            Categories
          </NavLink>

          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>

          <NavLink to="/profile/wishlist" className="relative">
            <div className="relative cursor-pointer">
              <FaRegHeart size={21} className="text-[#063352]" />

              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
          </NavLink>

          <NavLink to="/cart">
            <div className="relative cursor-pointer">
              <LuShoppingCart size={24} className="text-[#063352]" />

              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#063352] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
          </NavLink>

          <NavLink to="/profile">
            <LuUser size={24} className="text-[#063352]" />
          </NavLink>
        </div>

        <button
          className="lg:hidden text-[#063352]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t shadow-md px-4 py-5 flex flex-col gap-5">
          
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg bg-[#DEEFEF] py-2 px-4 pl-10 focus:outline-none focus:border-[#063352]"
            />

            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/categories"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Categories
          </NavLink>

          <NavLink
            to="/shop"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </NavLink>

          <NavLink
            to="/about"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>

          <div className="flex items-center gap-6 pt-2">
            <NavLink
              to="/profile/wishlist"
              onClick={() => setMenuOpen(false)}
            >
              <div className="relative">
                <FaRegHeart size={22} className="text-[#063352]" />

                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </NavLink>

            <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
              <div className="relative">
                <LuShoppingCart size={24} className="text-[#063352]" />

                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#063352] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </NavLink>

            <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
              <LuUser size={24} className="text-[#063352]" />
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;