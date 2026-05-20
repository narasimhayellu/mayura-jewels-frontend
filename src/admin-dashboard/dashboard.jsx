import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        "https://www.anuradhaartjewellery.com/api/frontend/products/"
      );

      console.log(response.data);

      setTotalProducts(
        response.data.products?.data?.length || 0
      );

      setTotalCategories(
        response.data.categories?.length || 0
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
   <div className="p-6 bg-gray-100 min-h-screen">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    <div className="bg-[#87ceff] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Sales Revenue
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        ₹0
      </p>
    </div>

    <div className="bg-[#679267] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Orders
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        0
      </p>
    </div>

    <div className="bg-[#65000b] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Complete Orders
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        0
      </p>
    </div>

    <div className="bg-[#32174d] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Pending Orders
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        0
      </p>
    </div>

    <div className="bg-[#483c32] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Cancelled Orders
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        0
      </p>
    </div>

    <div className="bg-[#bb2649] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Products
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        {totalProducts}
      </p>
    </div>

    <div className="bg-[#d7a14e] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Active Products
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        0
      </p>
    </div>

    <div className="bg-[#178d6d] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Inactive Products
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        0
      </p>
    </div>

    <div className="bg-[#d94194] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Sold Products
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        0
      </p>
    </div>

    <div className="bg-[#bb8b8f] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Categories
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        {totalCategories}
      </p>
    </div>

    <div className="bg-[#c9a0dc] shadow-lg rounded-xl p-6 ">
      <h1 className="text-lg font-semibold text-white">
        Total Customers
      </h1>

      <p className="text-3xl font-bold text-white mt-4">
        0
      </p>
    </div>

  </div>
</div>
  );
};

export default Dashboard;