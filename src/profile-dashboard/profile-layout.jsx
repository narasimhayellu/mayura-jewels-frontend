import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LuUser,
  LuPackage,
  LuHeart,
  LuMapPin,
  LuLock,
  LuLogOut,
} from "react-icons/lu";

import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const ProfileLayout = () => {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);

  const sideBarLinks = [
    {
      name: "Profile",
      path: "/profile",
      icon: <LuUser size={20} />,
    },
    {
      name: "Orders",
      path: "/profile/orders",
      icon: <LuPackage size={20} />,
    },
    {
      name: "Wishlist",
      path: "/profile/wishlist",
      icon: <LuHeart size={20} />,
    },
    {
      name: "My Address",
      path: "/profile/address",
      icon: <LuMapPin size={20} />,
    },
    {
      name: "Change Password",
      path: "/profile/change-password",
      icon: <LuLock size={20} />,
    },
  ];

  const baseClass =
    "flex items-center gap-4 px-4 sm:px-5 py-3 rounded-xl font-medium transition-all duration-200 w-full border border-transparent";

  const navLinkClass = ({ isActive }) =>
    `${baseClass} ${
      isActive
        ? "bg-[#063352] text-white shadow-md"
        : "text-[#063352] bg-white hover:bg-[#DEEFEF]"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");

    enqueueSnackbar("Logged out successfully", {
      variant: "info",
    });

    navigate("/login", { replace: true });
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10">
      <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 lg:px-10 py-5 text-sm">
        <Link
          className="text-black hover:text-[#063352] transition-colors"
          to="/"
        >
          Home
        </Link>

        <span className="text-gray-400">/</span>

        <p className="text-gray-500 font-medium">
          Profile
        </p>
      </div>

      <div className="lg:hidden px-4 sm:px-6 mb-4">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-full bg-[#063352] text-white py-3 rounded-xl font-semibold shadow-md"
        >
          {showSidebar ? "Close Menu" : "Open Dashboard Menu"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8">
        
        <aside
          className={`${
            showSidebar ? "flex" : "hidden"
          } lg:flex flex-col w-full lg:w-72 flex-shrink-0`}
        >
          <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm sticky top-24">
            
            <div className="bg-[#063352] rounded-2xl p-5 mb-5 text-white">
              <h2 className="text-lg font-bold">
                My Account
              </h2>
            </div>

            <div className="space-y-2">
              {sideBarLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === "/profile"}
                  className={navLinkClass}
                  onClick={() => setShowSidebar(false)}
                >
                  {link.icon}

                  <span className="text-sm sm:text-base">
                    {link.name}
                  </span>
                </NavLink>
              ))}

              <button
                onClick={handleLogout}
                className={`${baseClass} hover:bg-red-50 text-red-500 cursor-pointer`}
              >
                <LuLogOut size={20} />

                <span className="text-sm sm:text-base">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="bg-transparent rounded-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;