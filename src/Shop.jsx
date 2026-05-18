import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import { LuPackage } from "react-icons/lu";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSort, setShowSort] = useState(false);

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 1500,
  });

  const [debouncedPrice, setDebouncedPrice] = useState({
    min: 0,
    max: 1500,
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    if (categoryFromUrl) {
      setActiveCategoryId(categoryFromUrl);
    } else {
      setActiveCategoryId(null);
    }

    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrice(priceRange);
    }, 500);

    return () => clearTimeout(handler);
  }, [priceRange]);

  useEffect(() => {
    const syncWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await axios.get(
          "https://mayura-jewels-backend.onrender.com/api/backend/wishlists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const items = Array.isArray(res.data) ? res.data : [];

        setWishlistItems(items);
      } catch (err) {
        console.error(err);
      }
    };

    syncWishlist();
  }, []);

  const colors = [
    { name: "gold", hex: "#FFD700" },
    { name: "beige", hex: "#C0C0C0" },
    { name: "white", hex: "#FFFFFF" },
    { name: "brown", hex: "#800000" },
    { name: "indigo", hex: "#000080" },
    { name: "green", hex: "#3CB371" },
    { name: "yellow", hex: "#FFFF00" },
    { name: "orange", hex: "#FFA500" },
    { name: "pink", hex: "#FF1493" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (products.length === 0) {
          setLoading(true);
        }

        let url = `https://www.anuradhaartjewellery.com/api/frontend/products/?page=${page}&range=${debouncedPrice.min};${debouncedPrice.max}`;

        if (activeSubCategoryId && activeCategoryId) {
          url += `&category=${activeCategoryId}&sub_category=${activeSubCategoryId}`;
        } else if (activeCategoryId) {
          url += `&category=${activeCategoryId}`;
        }

        if (selectedColors.length > 0) {
          const selectedHexCodes = colors
            .filter((c) => selectedColors.includes(c.name))
            .map((c) => encodeURIComponent(c.hex))
            .join(",");

          url += `&color_code=${selectedHexCodes}`;
        }

        if (sortBy) {
          url += `&sort_by=${encodeURIComponent(sortBy)}`;
        }

        const response = await axios.get(url);

        if (response.data.products) {
          setProducts(response.data.products.data || []);
          setTotalPages(response.data.products.last_page || 1);
        }

        if (response.data.categories) {
          setCategories(response.data.categories);
        }

        const allSubs =
          response.data.filter_info?.categories?.flatMap(
            (cat) => cat.subcategories || [],
          ) || [];

        setSubCategories(allSubs);

        window.scrollTo(0, 0);

        setLoading(false);
      } catch (error) {
        console.error(error.response?.data);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    page,
    activeCategoryId,
    activeSubCategoryId,
    debouncedPrice,
    selectedColors,
    sortBy,
  ]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#063352]"></div>

        <p className="animate-pulse text-xl text-[#063352] font-serif">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="flex items-center gap-3 mx-4 md:mx-10 my-5 text-sm md:text-base flex-wrap">
        <Link className="no-underline text-black hover:text-[#063352]" to="/">
          Home
        </Link>

        <span className="text-gray-500">/</span>

        <p className="text-gray-500">Shop</p>
      </div>

      <div className="w-full">
        <img
          className="w-full h-[220px] sm:h-[300px] md:h-[400px] object-cover"
          src="https://miro.medium.com/v2/resize:fit:1200/0*8wumfoszAeEDcN1X."
          alt=""
        />
      </div>

      <div className="flex flex-col lg:flex-row p-3 md:p-5 gap-5">
        <div className="w-full lg:w-80 h-fit lg:sticky lg:top-[90px] max-h-fit overflow-visible lg:overflow-y-auto border border-gray-200 shadow-lg p-4 md:p-6 mt-2 flex flex-col gap-4 rounded-lg bg-white">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg md:text-[20px] font-serif text-start border-b border-gray-200 p-2">
              CATEGORIES
            </h1>

            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col">
                <button
                  onClick={() => {
                    const nextId =
                      activeCategoryId === cat.slug ? null : cat.slug;

                    setActiveCategoryId(nextId);
                    setActiveSubCategoryId(null);
                    setPage(1);
                  }}
                  className={`text-left py-2 px-3 cursor-pointer rounded-md transition-all font-medium flex justify-between items-center ${
                    activeCategoryId === cat.slug
                      ? "bg-[#063352] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="uppercase text-xs md:text-sm tracking-wide">
                    {cat.name}
                  </span>

                  <span>{activeCategoryId === cat.slug ? "⌃" : "⌵"}</span>
                </button>

                {activeCategoryId === cat.slug && (
                  <div className="flex flex-col ml-4 mt-1 pl-4 border-l-2 border-gray-100">
                    {subCategories
                      .filter(
                        (sub) => Number(sub.category_id) === Number(cat.id),
                      )
                      .map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => {
                            setActiveSubCategoryId(sub.slug);
                            setPage(1);
                          }}
                          className={`text-left py-2 text-xs uppercase transition-all cursor-pointer ${
                            activeSubCategoryId === sub.slug
                              ? "text-[#063352] font-black border-r-4 border-[#063352]"
                              : "text-gray-500 hover:text-[#063352]"
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <h1 className="text-lg md:text-[20px] font-serif text-start border-b border-gray-200 p-2">
              PRICE
            </h1>

            <div className="flex flex-col gap-3 p-2">
              <div className="relative w-full h-10 mt-4 flex items-center">
                <div className="absolute h-1.5 w-full bg-gray-200 rounded-lg"></div>

                <div
                  className="absolute h-1.5 bg-[#063352] rounded-lg z-10"
                  style={{
                    left: `${(priceRange.min / 1500) * 100}%`,
                    right: `${100 - (priceRange.max / 1500) * 100}%`,
                  }}
                ></div>

                <input
                  type="range"
                  min="0"
                  max="1500"
                  step="50"
                  value={priceRange.min}
                  onChange={(e) => {
                    const value = Math.min(
                      Number(e.target.value),
                      priceRange.max - 50,
                    );

                    setPriceRange((prev) => ({
                      ...prev,
                      min: value,
                    }));
                  }}
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20 accent-[#063352] [&::-webkit-slider-thumb]:pointer-events-auto"
                />

                <input
                  type="range"
                  min="0"
                  max="1500"
                  step="50"
                  value={priceRange.max}
                  onChange={(e) => {
                    const value = Math.max(
                      Number(e.target.value),
                      priceRange.min + 50,
                    );

                    setPriceRange((prev) => ({
                      ...prev,
                      max: value,
                    }));
                  }}
                  className="absolute w-full h-2 cursor-pointer appearance-none bg-transparent pointer-events-none z-20 accent-[#063352] [&::-webkit-slider-thumb]:pointer-events-auto"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>Price:</span>

                <span className="bg-[#063352] text-white px-3 py-1 rounded-full text-xs">
                  ₹{priceRange.min} - ₹{priceRange.max}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-serif text-lg md:text-xl text-start border-b border-gray-200 p-2 uppercase">
              Colour
            </h1>

            <div className="flex flex-col gap-2 p-3">
              {colors.map((color) => {
                const isSelected = selectedColors.includes(color.name);

                return (
                  <label
                    key={color.name}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      className="w-4 h-4"
                      onChange={() => {
                        setSelectedColors((prev) =>
                          prev.includes(color.name)
                            ? prev.filter((c) => c !== color.name)
                            : [...prev, color.name],
                        );
                      }}
                    />

                    <span
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ background: color.hex }}
                    ></span>

                    <span className="text-sm capitalize">{color.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-end items-center gap-4 p-3 m-2 md:mx-4 border border-gray-200 shadow-lg rounded-sm">
            <h2 className="text-[16px] md:text-[18px] font-mono text-[#063352]">
              Sort By:
            </h2>

            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="text-[14px] md:text-[16px] flex items-center gap-2 text-[#063352] border border-black px-4 py-2 rounded-md bg-white"
              >
                {sortBy || "Relevance"}
                <span
                  className={`text-xs transition-transform duration-300 ${
                    showSort ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {showSort && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  {[
                    "Relevance",
                    "Low to High",
                    "High to Low",
                    "Newest First",
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSort(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#063352] hover:bg-[#063352] hover:text-white transition-colors border-b border-gray-100"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!loading &&
            (products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 p-2 md:p-4">
                {products.map((product) => {
                  const isInWishlist = wishlistItems.some(
                    (item) => Number(item.product_id) === Number(product.id),
                  );

                  return (
                    <div key={product.id} className="relative group">
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          const token = localStorage.getItem("token");

                          if (!token) {
                            enqueueSnackbar("Please login to add wishlist", {
                              variant: "warning",
                            });
                            return;
                          }

                          try {
                            if (isInWishlist) {
                              const wishlistEntry = wishlistItems.find(
                                (item) =>
                                  Number(item.product_id) ===
                                  Number(product.id),
                              );

                              await axios.delete(
                                `https://mayura-jewels-backend.onrender.com/api/backend/wishlists/${wishlistEntry._id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                },
                              );

                              setWishlistItems((prev) =>
                                prev.filter(
                                  (item) =>
                                    Number(item.product_id) !==
                                    Number(product.id),
                                ),
                              );

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

                              const newItem =
                                response.data.wishlist || response.data.data;

                              setWishlistItems((prev) => [
                                ...prev,
                                {
                                  ...newItem,
                                  product_id: product.id,
                                },
                              ]);

                              enqueueSnackbar("Added to wishlist", {
                                variant: "success",
                              });
                            }

                            window.dispatchEvent(new Event("wishlistUpdated"));
                          } catch (error) {
                            console.log(error);

                            enqueueSnackbar("Wishlist operation failed", {
                              variant: "error",
                            });
                          }
                        }}
                        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2 bg-white/90 rounded-full shadow-md cursor-pointer active:scale-95"
                      >
                        {isInWishlist ? (
                          <FaHeart size={18} className="text-red-500" />
                        ) : (
                          <FaRegHeart size={18} className="text-gray-400" />
                        )}
                      </button>

                      <Link
                        to={`/product/${product.slug}`}
                        className="flex flex-col h-full text-start p-2 md:p-3 border border-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                      >
                        <img
                          src={`https://www.anuradhaartjewellery.com/public/${product.thumb_image}`}
                          alt={product.name}
                          className="border border-gray-100 w-full rounded-lg h-[250px] sm:h-[280px] object-cover"
                        />

                        <div className="flex-grow">
                         <h1 className="text-sm md:text-base leading-normal my-3 line-clamp-2 sm:line-clamp-3 break-words whitespace-normal">
                            {product.name}
                          </h1>
                        </div>

                        <div className="m-2">
                          <h1 className="font-bold text-lg md:text-[22px]">
                            ₹{product.price}
                          </h1>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
                <div className="bg-gray-100 p-8 rounded-full mb-6">
                  <LuPackage size={60} className="text-gray-400" />
                </div>

                <h2 className="text-2xl font-serif text-[#063352] mb-2">
                  No Products Found
                </h2>

                <button
                  onClick={() => {
                    setActiveCategoryId(null);
                    setActiveSubCategoryId(null);
                    setPriceRange({ min: 0, max: 1500 });
                    setSelectedColors([]);
                    setSearchParams({});
                    setPage(1);
                  }}
                  className="bg-[#063352] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0a4570] transition-all"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ))}

          <div className="flex flex-wrap justify-center items-center gap-2 mt-auto pt-6 px-2 pb-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded cursor-pointer ${
                page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((num) => num >= page - 2 && num <= page + 2)
              .map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-4 py-2 rounded cursor-pointer ${
                    page === num
                      ? "bg-[#063352] text-white font-bold"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-7 py-2 rounded cursor-pointer ${
                page === totalPages ? "bg-gray-400" : "bg-[#063352] text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
