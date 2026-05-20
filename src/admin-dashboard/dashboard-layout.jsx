import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  Settings,
  Shapes,
  ShoppingBag,
  PackageCheck,
  CreditCard,
  Users,
  MessageSquare,
  Truck,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const DashboardLayout = () => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.clear();

    window.location.href = "/admin/login";
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Sliders",
      icon: <Image size={20} />,
      path: "/admin/sliders",
    },
    {
      name: "Home Page Setting Manage",
      icon: <Settings size={20} />,
      path: "/admin/home-settings",
    },
    {
      name: "Categories Manage",
      icon: <Shapes size={20} />,
      path: "/admin/categories",
    },
    {
      name: "Product Manage",
      icon: <ShoppingBag size={20} />,
      path: "/admin/products",
    },
    {
      name: "Orders Manage",
      icon: <PackageCheck size={20} />,
      path: "/admin/orders",
    },
    {
      name: "Transactions",
      icon: <CreditCard size={20} />,
      path: "/admin/transactions",
    },
    {
      name: "Customer Management",
      icon: <Users size={20} />,
      path: "/admin/customers",
    },
    {
      name: "Contact Us List",
      icon: <MessageSquare size={20} />,
      path: "/admin/contact-list",
    },
    {
      name: "Shipping Rule",
      icon: <Truck size={20} />,
      path: "/admin/shipping-rule",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-72 bg-[#063352] text-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-[#1b4a69]">
          <h1 className="text-3xl  tracking-wide">
            Mayura Jewels
          </h1>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-[#063352] font-semibold"
                    : "hover:bg-[#0a4c78]"
                }`
              }
            >
              {item.icon}

              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3">
        <div className="bg-white shadow-md border-b border-gray-200 rounded-[5px] px-6 py-4 flex justify-end">

          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-2"
            >
              <UserCircle size={38} className="text-[#063352]" />

              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  openDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                
                <button className="w-full text-left px-5 py-3 hover:bg-gray-100 transition">
                  My Profile
                </button>

                <button className="w-full text-left px-5 py-3 hover:bg-gray-100 transition">
                  Change Password
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;