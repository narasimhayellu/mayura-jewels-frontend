import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { IoCheckmarkCircle } from "react-icons/io5";
import { LuPackage, LuGem, LuGlobe } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { enqueueSnackbar } from "notistack";
import { useCart } from "./cartContext";

const Productdetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  const [selectedImage, setSelectedImage] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [wishlistItems, setWishlistItems] = useState([]);

  const { slug } = useParams();

  const navigate = useNavigate();

  const scrollRef = useRef(null);

  const { addToCart, setCheckoutItems } = useCart();

  const addToWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Please login first", {
        variant: "warning",
      });

      return;
    }

    const existingEntry = wishlistItems.find(
      (item) => Number(item.product_id) === Number(product.id),
    );

    try {
      if (existingEntry) {
        await axios.delete(
          `https://mayura-jewels-backend.onrender.com/api/backend/wishlists/${existingEntry._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const updatedItems = wishlistItems.filter(
          (item) => Number(item.product_id) !== Number(product.id),
        );

        setWishlistItems(updatedItems);

        setIsWishlisted(false);

        window.dispatchEvent(new Event("wishlistUpdated"));

        enqueueSnackbar("Removed from wishlist", {
          variant: "error",
        });
      } else {
        const response = await axios.post(
          "https://mayura-jewels-backend.onrender.com/api/backend/wishlists",
          {
            product_id: product.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const newItem = response.data.data || response.data.wishlist;

        const updatedItems = [
          ...wishlistItems,
          {
            ...newItem,
            product_id: product.id,
          },
        ];

        setWishlistItems(updatedItems);

        setIsWishlisted(true);

        window.dispatchEvent(new Event("wishlistUpdated"));

        enqueueSnackbar("Added to wishlist", {
          variant: "success",
        });
      }
    } catch (error) {
      console.log(error);

      enqueueSnackbar("Wishlist operation failed", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (product && wishlistItems.length > 0) {
      const found = wishlistItems.some(
        (item) => Number(item.product_id) === Number(product.id),
      );

      setIsWishlisted(found);
    } else {
      setIsWishlisted(false);
    }
  }, [product, wishlistItems]);

  const scroll = (direction) => {
    const allImages = [
      product.thumb_image,
      ...(product.product_image_galleries?.map((g) => g.image) || []),
    ];

    const newIndex =
      direction === "left"
        ? Math.max(0, currentIndex - 1)
        : Math.min(allImages.length - 1, currentIndex + 1);

    setCurrentIndex(newIndex);

    setSelectedImage(allImages[newIndex]);

    const thumbnails = scrollRef.current?.children;

    if (thumbnails?.[newIndex]) {
      thumbnails[newIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.anuradhaartjewellery.com/api/frontend/products/${slug}`,
        );

        const productData =
          response.data.product?.data || response.data.product;

        setProduct(productData);

        setSelectedImage(productData.thumb_image);

        setLoading(false);
      } catch (error) {
        console.log(error);

        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await axios.get(
          "https://mayura-jewels-backend.onrender.com/api/backend/wishlists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const items = Array.isArray(response.data) ? response.data : [];

        setWishlistItems(items);
      } catch (error) {
        console.log("Wishlist fetch error:", error);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Please login first", {
        variant: "warning",
      });

      return;
    }

    addToCart(product);

    window.dispatchEvent(new Event("cartUpdated"));

    enqueueSnackbar("Item added to cart", {
      variant: "success",
    });
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Please login first", {
        variant: "warning",
      });

      return;
    }

    try {
      const buyNowItem = {
        _id: `buynow_${product.id}`,
        product: product,
        product_id: String(product.id),
        quantity: 1,
        qty: 1,
        price: product.price,
        unit_price: product.price,
        product_name: product.name,
        thumb_image: product.thumb_image,
      };

      setCheckoutItems([buyNowItem]);

      enqueueSnackbar("Redirecting to checkout...", {
        variant: "success",
      });

      navigate("/checkout");
    } catch (error) {
      console.log(error);

      enqueueSnackbar("Failed to process product", {
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 px-4">
        <div className="animate-spin rounded-full h-14 w-14 sm:h-16 sm:w-16 border-t-4 border-b-4 border-[#063352]"></div>

        <p className="text-[#063352] font-serif text-lg sm:text-xl animate-pulse text-center">
          Loading your jewellery...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <p className="p-20 text-center text-lg">
        Product not found
      </p>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="flex flex-wrap items-center gap-3 px-4 sm:px-8 lg:px-12 py-6">
        <Link
          className="no-underline text-black hover:text-[#063352] text-sm sm:text-base"
          to="/"
        >
          Home
        </Link>

        <span className="text-gray-500">/</span>

        <p className="text-gray-500 text-sm sm:text-base">
          Product Details
        </p>
      </div>

      <div className="w-full">
        <img
          src="https://quotefancy.com/media/wallpaper/3840x2160/1788148-Warren-Buffett-Quote-If-you-don-t-know-the-Jewelry-know-the.jpg"
          className="h-[220px] sm:h-[300px] lg:h-[420px] w-full object-cover"
          alt=""
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-square border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm relative">
            <img
              src={`https://www.anuradhaartjewellery.com/public/${
                selectedImage || product.thumb_image
              }`}
              className="h-full w-full object-contain p-3 sm:p-4"
              alt={product.name}
            />

            <button
              onClick={addToWishlist}
              className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition-all cursor-pointer"
            >
              {isWishlisted ? (
                <FaHeart size={22} className="text-red-500" />
              ) : (
                <FaRegHeart
                  size={22}
                  className="text-gray-400 hover:text-red-500"
                />
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              className="bg-black text-white rounded-full text-lg font-bold h-[42px] w-[42px] sm:h-[50px] sm:w-[50px] flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0 cursor-pointer"
              onClick={() => scroll("left")}
            >
              ❮
            </button>

            <div className="overflow-hidden w-full max-w-[260px] sm:max-w-[360px]">
              <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar py-2"
              >
                <div
                  onClick={() => setSelectedImage(product.thumb_image)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-md cursor-pointer shrink-0 ${
                    selectedImage === product.thumb_image
                      ? "border-[#063352]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={`https://anuradhaartjewellery.com/public/${product.thumb_image}`}
                    className="w-full h-full object-cover rounded-md"
                    alt=""
                  />
                </div>

                {product.product_image_galleries?.map((gallery, index) => (
                  <div
                    key={gallery.id}
                    onClick={() => {
                      setSelectedImage(gallery.image);

                      setCurrentIndex(index + 1);
                    }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-md cursor-pointer shrink-0 ${
                      selectedImage === gallery.image
                        ? "border-[#063352]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={`https://anuradhaartjewellery.com/public/${gallery.image}`}
                      className="w-full h-full object-cover rounded-md"
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              className="bg-black text-white rounded-full text-lg font-bold h-[42px] w-[42px] sm:h-[50px] sm:w-[50px] flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0 cursor-pointer"
              onClick={() => scroll("right")}
            >
              ❯
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-serif text-[#063352] leading-relaxed">
            {product.name}
          </h1>

          <p className="text-2xl sm:text-4xl font-bold text-gray-800 py-4">
            ₹{product.price}/-
          </p>

          <p className="text-sm sm:text-base text-gray-700">
            SKU : {product.sku}
          </p>

          <div className="border-y border-gray-200 py-4 my-4">
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {product.short_description || "No description available."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={addToWishlist}
              className={`cursor-pointer border-2 p-3 sm:p-4 rounded-lg font-bold transition-colors text-sm sm:text-base ${
                isWishlisted
                  ? "border-red-500 text-red-500 hover:bg-red-50"
                  : "border-[#063352] text-[#063352] hover:bg-gray-50"
              }`}
            >
              {isWishlisted
                ? "REMOVE FROM WISHLIST"
                : "ADD TO WISHLIST"}
            </button>

            <button
              onClick={handleAddToCart}
              className="cursor-pointer bg-[#063352] text-white p-3 sm:p-4 rounded-lg font-bold hover:bg-[#0a4570] transition-colors text-sm sm:text-base"
            >
              ADD TO CART
            </button>

            <button
              onClick={handleBuyNow}
              className="cursor-pointer bg-[#058743] text-white p-3 sm:p-4 rounded-lg font-bold hover:bg-[#009c4a] transition-colors text-sm sm:text-base"
            >
              BUY NOW
            </button>
          </div>

          <div className="mt-6 space-y-3 text-sm sm:text-base lg:text-lg">
            <h1 className="flex gap-2">
              <IoCheckmarkCircle className="mt-1 shrink-0" />
              COD, Easy Returns & Quick Exchanges
            </h1>

            <h1 className="flex gap-2">
              <MdDeliveryDining className="mt-1 shrink-0" />
              Express 24-Hour Delivery (Charges Apply)
            </h1>

            <h1 className="flex gap-2">
              <LuPackage className="mt-1 shrink-0" />
              Free Shipping on Prepaid Orders Above ₹1000
            </h1>

            <h1 className="flex gap-2">
              <LuGem className="mt-1 shrink-0" />
              Premium Quality Stones, Plating & Handwork
            </h1>

            <h1 className="flex gap-2">
              <LuGlobe className="mt-1 shrink-0" />
              Trusted by 1.2M+ Customers Worldwide
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-20 mt-4">
        <div className="flex flex-wrap">
          <button
            onClick={() => setActiveTab("description")}
            className={`border border-gray-200 shadow-sm px-5 sm:px-7 py-3 cursor-pointer text-sm sm:text-base ${
              activeTab === "description"
                ? "bg-[#063352] text-white"
                : "hover:bg-[#f1f1f1]"
            }`}
          >
            DESCRIPTION
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`border border-gray-200 shadow-sm px-5 sm:px-10 py-3 cursor-pointer text-sm sm:text-base ${
              activeTab === "reviews"
                ? "bg-[#063352] text-white"
                : "hover:bg-[#f1f1f1]"
            }`}
          >
            REVIEWS
          </button>
        </div>

        <div className="border border-gray-200 my-3 mb-10 rounded-sm shadow-sm p-4 sm:p-6">
          {activeTab === "description" && (
            <div>
              <h1 className="text-lg sm:text-[22px] mb-3 font-serif text-[#063352]">
                Product Description
              </h1>

              <p className="leading-relaxed text-gray-700 text-sm sm:text-base">
                {product.long_description}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h1 className="text-lg sm:text-[22px] font-serif mb-3 text-[#063352]">
                Reviews ({product.reviews_count || 0})
              </h1>

              {product.reviews_count > 0 ? (
                <p className="text-sm sm:text-base">
                  Showing reviews here...
                </p>
              ) : (
                <p className="italic text-gray-600 text-sm sm:text-base">
                  No reviews yet. Be the first one to review this product!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productdetails;