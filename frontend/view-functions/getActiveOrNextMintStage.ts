import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/utils/aptosClient";
import { NFT_MODULE_ADDRESS } from "@/constants";

type GetRegistryArguments = {
  collection_address: string;
};

export const getActiveOrNextMintStage = async ({ collection_address }: GetRegistryArguments) => {
  const mintStageRes = await aptosClient().view<[{ vec: [string] | [] }]>({
    payload: {
      function: `${AccountAddress.from(NFT_MODULE_ADDRESS)}::vestpad::get_active_or_next_mint_stage`,
      functionArguments: [collection_address],
    },
  });
  return mintStageRes[0].vec;
};
