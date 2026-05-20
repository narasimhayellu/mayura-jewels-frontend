import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [index, setIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);
  const [catIndex, setCatIndex] = useState(0);

  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

 const fetchHomeData = async () => {
  try {
  const response = await axios.get("https://mayura-jewels-backend.onrender.com/api/banner");

    setBanners(response.data.banners);
  } catch (error) {
    console.log(error);
  }
};

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://www.anuradhaartjewellery.com/api/frontend/products/",
      );
      setCategories(response.data.categories || []);
      setProducts(response.data.products.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHomeData();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [banners]);

  const nextProd = () => {
    setProductIndex((prev) => (prev + 1) % products.length);
  };

  const prevProd = () => {
    setProductIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const nextCat = () => {
    setCatIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCat = () => {
    setCatIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const visibleProducts = [];

  if (products.length > 0) {
    const cardsToShow =
      window.innerWidth < 640
        ? 1
        : window.innerWidth < 768
          ? 2
          : window.innerWidth < 1024
            ? 3
            : 5;

    for (let i = 0; i < cardsToShow; i++) {
      visibleProducts.push(products[(productIndex + i) % products.length]);
    }
  }

  const visibleCategories = [];

  if (categories.length > 0) {
    const cardsToShow =
      window.innerWidth < 640
        ? 1
        : window.innerWidth < 768
          ? 2
          : window.innerWidth < 1024
            ? 3
            : 5;

    for (let i = 0; i < cardsToShow; i++) {
      visibleCategories.push(categories[(catIndex + i) % categories.length]);
    }
  }

  if (!banners.length && !products.length) {
    return (
      <div className="flex flex-col pb-20 justify-center items-center h-screen gap-4">
        <div className="animate-spin rounded-full h-14 w-14 md:h-16 md:w-16 border-t-4 border-b-4 border-[#063352]"></div>

        <p className="text-[#063352] font-serif text-lg md:text-xl animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden flex flex-col">
      <div className="relative w-full overflow-hidden">
        {banners.map((banner, i) => (
          <div
            key={i}
            className={`absolute top-0 left-0 w-full transition-opacity duration-1000 ${
              index === i ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="w-full h-[180px] sm:h-[350px] md:h-[500px] lg:h-[70vh] overflow-hidden">
              <img
                className="w-full h-full object-cover object-center sm:object-cover"
                src={banner.image}
                alt={banner.banner_content}
              />
            </div>
          </div>
        ))}
        <div className="h-[250px] sm:h-[350px] md:h-[500px] lg:h-[70vh]"></div>
      </div>

      <div className="md:my-12 w-full flex flex-col">
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-25 mb-5">
          <h2 className="text-[#063352] text-xl sm:text-2xl lg:text-3xl font-bold font-serif">
            Our Categories
          </h2>

          <Link
            to="/categories"
            className="text-[#063352] text-sm md:text-base font-semibold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="flex justify-center items-center gap-2 sm:gap-4 px-2 sm:px-4">
          <button
            onClick={prevCat}
            className="bg-black text-white rounded-full h-[38px] w-[38px] sm:h-[45px] sm:w-[45px] md:h-[50px] md:w-[50px] flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0 cursor-pointer"
          >
            ❮
          </button>

          <div className="flex gap-3 sm:gap-4 overflow-hidden">
            {visibleCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="bg-white rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 w-[220px] sm:w-[240px] md:w-[220px] lg:w-[230px] shadow-lg overflow-hidden shrink-0 flex flex-col group"
              >
                <div className="overflow-hidden">
                  <img
                    className="w-full h-[220px] sm:h-[250px] object-cover transition-transform duration-500 group-hover:scale-110"
                    src={`https://gdrbjewellery.axylotech.com/public/${cat.cat_image}`}
                    alt={cat.name}
                  />
                </div>

                <div className="flex items-center justify-center flex-grow p-3">
                  <h3 className="text-[#063352] text-base sm:text-lg font-semibold text-center">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={nextCat}
            className="bg-black text-white rounded-full h-[38px] w-[38px] sm:h-[45px] sm:w-[45px] md:h-[50px] md:w-[50px] flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0 cursor-pointer"
          >
            ❯
          </button>
        </div>
      </div>

      <div className="my-5 md:mb-12 w-full flex flex-col">
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-25 mb-5">
          <h2 className="text-[#063352] text-xl sm:text-2xl lg:text-3xl font-bold font-serif">
            New Arrivals
          </h2>

          <Link
            to="/shop"
            className="text-[#063352] text-sm md:text-base font-semibold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="flex justify-center items-center gap-2 sm:gap-4 px-2 sm:px-4">
          <button
            onClick={prevProd}
            className="bg-black text-white rounded-full h-[38px] w-[38px] sm:h-[45px] sm:w-[45px] md:h-[50px] md:w-[50px] flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0 cursor-pointer"
          >
            ❮
          </button>

          <div className="flex gap-3 sm:gap-4 overflow-hidden">
            {visibleProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="bg-white rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 w-[220px] sm:w-[240px] md:w-[220px] lg:w-[230px] shadow-lg overflow-hidden shrink-0 flex flex-col group"
              >
                <div className="overflow-hidden">
                  <img
                    className="w-full h-[220px] sm:h-[250px] object-cover transition-transform duration-500 group-hover:scale-110"
                    src={`https://www.anuradhaartjewellery.com/public/${product.thumb_image}`}
                    alt={product.name}
                  />
                </div>

                <div className="flex flex-col justify-center flex-grow p-3 gap-2">
                  <p
                    className="text-sm sm:text-base text-start overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      height: "40px",
                      lineHeight: "20px",
                    }}
                  >
                    {product.name}
                  </p>

                  <h4 className="font-bold text-start text-[#063352] text-base sm:text-lg">
                    ₹{product.price}
                  </h4>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={nextProd}
            className="bg-black text-white rounded-full h-[38px] w-[38px] sm:h-[45px] sm:w-[45px] md:h-[50px] md:w-[50px] flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0 cursor-pointer"
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
