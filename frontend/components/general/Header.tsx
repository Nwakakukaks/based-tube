import { useLocation, useNavigate } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { Button } from "../ui/button";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHome = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div className="w-full bg-blue-50 p-1">
        <p className="text-xs text-center text-black">
          We appreciate you exploring our beta! Your feedback helps us grow and improve.
        </p>
      </div>

      <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap lg:px-20 mt-1">
        <h3 onClick={handleHome} className="text-xl font-bold cursor-pointer">
          SuperBase
        </h3>

        {location.pathname === "/" && (
          <div className="flex items-center space-x-8 text-sm font-medium mt-1">
            <p className="cursor-pointer">Company</p>
            <p className="cursor-pointer">Product</p>
            <p className="cursor-pointer">Contact us</p>
          </div>
        )}

        <div className=" flex items-center space-x-4">
          {location.pathname === "/" ? (
            <Button onClick={handleLogin} className="bg-blue-600 rounded-full py-3 px-8 hover:bg-blue-300">
              Login
            </Button>
          ) : (
            <WalletSelector />
          )}
        </div>
      </div>
    </>
  );
}
