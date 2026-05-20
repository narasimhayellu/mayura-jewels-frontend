import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { enqueueSnackbar } from "notistack";
import { useCart } from "../cartContext";
import { LuHeartOff } from "react-icons/lu";

const ITEMS_PER_PAGE = 5;

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [wishlistRes, productsRes] = await Promise.all([
          axios.get("https://mayura-jewels-backend.onrender.com/api/backend/wishlists", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get(
            "https://www.anuradhaartjewellery.com/api/frontend/products/?per_page=1000",
          ),
        ]);

        const items = Array.isArray(wishlistRes.data)
          ? wishlistRes.data
          : [];

        const allProducts =
          productsRes.data.products?.data || [];

        const itemsWithProducts = items.map((item) => {
          const product = allProducts.find(
            (p) =>
              Number(p.id) === Number(item.product_id),
          );

          return {
            ...item,
            product: product || null,
          };
        });

        setWishlistItems(itemsWithProducts);
      } catch (error) {
        console.error("Error fetching wishlist:", error);

        enqueueSnackbar(
          "Failed to load wishlist",
          {
            variant: "error",
          },
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `https://mayura-jewels-backend.onrender.com/api/backend/wishlists/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setWishlistItems((prev) =>
        prev.filter(
          (item) => (item.id || item._id) !== id,
        ),
      );

      enqueueSnackbar("Removed from wishlist", {
        variant: "success",
      });
    } catch (error) {
      console.error("Remove error:", error);

      enqueueSnackbar("Failed to remove item", {
        variant: "error",
      });
    }
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Please login first", {
        variant: "warning",
      });

      return;
    }

    try {
      await addToCart(product);

      enqueueSnackbar("Item added to cart", {
        variant: "success",
      });

      navigate("/cart");
    } catch (error) {
      console.log(error);

      enqueueSnackbar("Failed to add item", {
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[400px] gap-4">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#063352]"></div>

        <p className="text-[#063352] font-serif text-lg md:text-xl animate-pulse text-center">
          Loading your wishlist...
        </p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <LuHeartOff
            size={45}
            className="text-gray-400"
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-serif text-[#063352] mb-3">
          Your Wishlist is Empty
        </h2>

        <p className="text-gray-500 max-w-md mb-8 leading-relaxed text-sm md:text-base">
          Save your favorite jewellery pieces here and
          shop them anytime later.
        </p>

        <button
          onClick={() => navigate("/shop")}
          className="bg-[#063352] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0a4570] transition-all"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(
    wishlistItems.length / ITEMS_PER_PAGE,
  );

  const paginated = wishlistItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-5 md:px-0 mb-14">
      <div className="flex flex-col gap-4">
        {paginated.map((item) => (
          <div
            key={item.id || item._id}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <Link
                to={
                  item.product
                    ? `/product/${item.product.slug}`
                    : "#"
                }
                className="flex-shrink-0 self-center sm:self-start"
              >
                {item.product ? (
                  <img
                    src={`https://www.anuradhaartjewellery.com/public/${item.product.thumb_image}`}
                    alt={item.product.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl border border-gray-100"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                    <p className="text-gray-400 text-xs text-center px-2">
                      Unavailable
                    </p>
                  </div>
                )}
              </Link>

              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="text-center sm:text-left">
                  {item.product ? (
                    <>
                      <Link
                        to={`/product/${item.product.slug}`}
                      >
                        <h2 className="font-medium text-gray-800 text-sm sm:text-base md:text-lg hover:text-[#063352] transition-colors line-clamp-2">
                          {item.product.name}
                        </h2>
                      </Link>

                      <p className="text-[#063352] text-xl md:text-2xl font-bold mt-3">
                        ₹ {item.product.price}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic">
                      Product no longer available
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    onClick={() =>
                      removeFromWishlist(
                        item.id || item._id,
                      )
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-100 bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <MdDeleteOutline size={22} />
                    <span className="text-sm font-medium">
                      Remove
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      handleAddToCart(item.product)
                    }
                    disabled={!item.product}
                    className="bg-[#063352] text-white px-5 py-2.5 cursor-pointer rounded-lg hover:bg-[#0a4570] transition-colors text-sm font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
          <button
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              page === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1,
          ).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                page === num
                  ? "bg-[#063352] text-white"
                  : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1),
              )
            }
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              page === totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-[#063352] text-white hover:bg-[#0a4570]"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;