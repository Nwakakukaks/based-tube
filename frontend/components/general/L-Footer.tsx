import { useLocation } from "react-router-dom";

export function LFooter() {
  const location = useLocation();
  const showIcon = location.pathname === "/";

  return (
    <>
      <div className="flex justify-between items-start my-6 px-20 ">
        <div>
          <p className="text-teal-400 font-semibold text-xl">APT-link</p>
          <p className="text-sm w-48 lg:w-96">
            Create and get shareable dapp links on any web environment. Access all the possibilities on Aptos.
          </p>
        </div>
        <div className="flex space-x-3 items-center">
          {showIcon && (
            <img
              src="/public/icons/Twitter X.svg"
              className="bg-white rounded-sm w-6 h-6 mr-4"
              alt="Twitter"
            />
          )}
        </div>
      </div>

      {/* Todo: add image here */}
    </>
  );
}
