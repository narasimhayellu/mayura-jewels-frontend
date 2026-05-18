import { Outlet,} from "react-router-dom";

const CheckoutLayout = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pb-6">
        <Outlet />
      </div>
    </div>
  );
};

export default CheckoutLayout;
