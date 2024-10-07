import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/utils/aptosClient";
import { T_MINTING_MODULE, NFT_MODULE_ADDRESS } from "@/constants";

type GetUserMintBalanceArguments = {
  fa_address: string;
  user_address: string;
};

export const getUserMintBalance = async ({ fa_address, user_address }: GetUserMintBalanceArguments) => {
  const userMintedAmount = await aptosClient().view<[string]>({
    payload: {
      function: `${AccountAddress.from(T_MINTING_MODULE)}::launchpad::get_mint_balance`,
      functionArguments: [fa_address, user_address],
    },
  });

  return Number(userMintedAmount[0]);
};

type GetUserMintBalanceArgumentsNFT = {
  collection_address: string;
  mint_stage: string;
  user_address: string;
};

export const getUserMintBalanceNFT = async ({
  collection_address,
  mint_stage,
  user_address,
}: GetUserMintBalanceArgumentsNFT) => {
  const userMintedAmount = await aptosClient().view<[string]>({
    payload: {
      function: `${AccountAddress.from(NFT_MODULE_ADDRESS)}::vestpad::get_mint_balance`,
      functionArguments: [collection_address, mint_stage, user_address],
    },
  });

  return Number(userMintedAmount[0]);
};
