import React from "react";
import DynamicMint from "./token";

const Claim: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 w-[90%] p-4">
      <DynamicMint />
    </div>
  );
};

export default Claim;
