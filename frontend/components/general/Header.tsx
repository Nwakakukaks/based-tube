import { useNavigate } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";

export function Header() {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="w-full bg-teal-200 p-1">
        <p className="text-sm text-center text-black">
          We appreciate you exploring our beta! Your feedback helps us grow and improve.
        </p>
      </div>

      <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap lg:px-20 mt-1">
        <h3 onClick={handleHome} className="text-xl font-bold cursor-pointer">
          APT-link
        </h3>

        <div className="">
          <WalletSelector />
        </div>
      </div>
    </>
  );
}
