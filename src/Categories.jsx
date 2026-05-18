import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LuArrowRight } from "react-icons/lu";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "https://www.anuradhaartjewellery.com/api/frontend/products",
        );

        setCategories(res.data.categories || []);
        setLoading(false);
      } catch (error) {
        console.log("Error:", error.response?.data);
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const CategoryCard = ({ cat, height }) => (
    <Link
      to={`/shop?category=${cat.slug}`}
      className={`group relative flex flex-col items-center ${height} border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all duration-300 bg-white hover:-translate-y-2 hover:shadow-2xl`}
    >
      <img
        src={`https://www.anuradhaartjewellery.com/public/${cat.cat_image}`}
        alt={cat.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white p-4">
        <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-widest text-center">
          {cat.name}
        </h2>

        <button className="px-6 sm:px-9 py-2 border-2 border-white bg-white text-black cursor-pointer rounded-md tracking-wide transition-all duration-300 hover:bg-[#063352] hover:text-white">
          Discover
        </button>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-4 pb-20 justify-center items-center h-screen">
        <div className="animate-spin h-16 w-16 rounded-full border-t-4 border-b-4 border-[#063352]"></div>

        <p className="animate-pulse text-xl text-[#063352] font-serif">
          Loading...
        </p>
      </div>
    );
  }

  const firstCategory = categories[0];
  const remainingCategories = categories.slice(1);

  return (
    <div className="flex flex-col gap-4 overflow-x-hidden">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mx-4 sm:mx-6 mt-4">
        <Link
          className="no-underline text-black hover:text-[#063352] transition-colors"
          to="/"
        >
          Home
        </Link>

        <span className="text-gray-400">/</span>

        <p className="text-gray-500 font-medium">Categories</p>
      </div>

      <div className="w-full sm:px-4">
        <img
          className="h-[220px] sm:h-[300px] lg:h-[450px] w-full object-cover rounded-xl"
          src="https://miro.medium.com/v2/resize:fit:1200/0*93PTQtG09p5agjIW."
          alt="Jewellery Banner"
        />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10 mb-10 lg:mb-16 px-4 sm:px-8 lg:px-20 py-4 rounded-2xl">
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <h1 className="uppercase text-[#063352] text-sm sm:text-[17px] tracking-widest">
            free shipping for
          </h1>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#063352] tracking-wide">
            The Bestsellers
          </h2>

          <p className="text-gray-600 leading-relaxed italic text-sm sm:text-base">
            At Mayura Jewels, we believe you deserve elegant jewellery with
            premium quality, affordable prices, and timeless craftsmanship.
          </p>

          <Link to="/shop">
            <button className="group mt-4 px-5 py-3 text-[#063352] inline-flex items-center bg-white border border-gray-300 rounded-md font-bold hover:bg-[#0a4570] hover:text-white transition-colors cursor-pointer">
              View
              <LuArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>

        {firstCategory && (
          <CategoryCard
            cat={firstCategory}
            height="h-[320px] sm:h-[360px] w-full sm:w-[400px]"
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 px-4 sm:px-8 lg:px-20">
        {remainingCategories.map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            height="h-[300px] sm:h-[350px]"
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;