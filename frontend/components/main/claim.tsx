import React from "react";
import DynamicMint from "./token";
import NFT from "./nft";

const Claim: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DynamicMint />
      <NFT />
    </div>
  );
};

export default Claim;
