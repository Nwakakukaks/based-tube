import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { NFT_MODULE_ADDRESS } from "@/constants";

export type MintNftArguments = {
  collectionId: string;
  amount: number;
};

export const mintNFT = (args: MintNftArguments): InputTransactionData => {
  const { collectionId, amount } = args;
  return {
    data: {
      function: `${NFT_MODULE_ADDRESS}::vestpad::mint_nft`,
      typeArguments: [],
      functionArguments: [collectionId, amount],
    },
  };
};
