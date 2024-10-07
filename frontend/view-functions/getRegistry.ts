import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/utils/aptosClient";
import { NFT_MODULE_ADDRESS, T_MINTING_MODULE } from "@/constants";

export const getRegistry = async () => {
  const registry = await aptosClient().view<[[{ inner: string }]]>({
    payload: {
      function: `${AccountAddress.from(T_MINTING_MODULE)}::launchpad::get_registry`,
    },
  });
  return registry[0];
};

export const getRegistryNFT = async () => {
  const registry = await aptosClient().view<[[{ inner: string }]]>({
    payload: {
      function: `${AccountAddress.from(NFT_MODULE_ADDRESS)}::vestpad::get_registry`,
    },
  });
  return registry[0];
};
