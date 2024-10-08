import { FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { DateTimeInput } from "../ui/date-time-input";
import { LabeledInput } from "../ui/labeled-input";
import { ConfirmButton } from "../ui/confirm-button";
import { uploadCollectionData } from "@/utils/assetsUploader";
import { createCollection } from "@/entry-functions/create_collection";
import { aptosClient } from "@/utils/aptosClient";
import { useGetCollections } from "@/hooks/useGetCollections";
import { GetCollectionDataResponse } from "@aptos-labs/ts-sdk";
import { toast } from "../ui/use-toast";
import { mintNFT } from "@/entry-functions/mint_nft";
import { useGetCollectionData } from "@/hooks/useGetCollectionData";
import { useQueryClient } from "@tanstack/react-query";
import { clampNumber } from "@/utils/clampNumber";
import { useLocation } from "react-router-dom";

const NFT = () => {
  const location = useLocation();
  const aptosWallet = useWallet();
  const collections: Array<GetCollectionDataResponse> = useGetCollections();

  function getLastCollection(collections: Array<GetCollectionDataResponse>): GetCollectionDataResponse | null {
    if (collections.length === 0) {
      return null;
    }
    return collections[collections.length - 2];
  }

  const isCollectionCreated = getLastCollection(collections);

  const { data } = useGetCollectionData(isCollectionCreated?.collection_id);
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number>(1);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [preMintAmount, setPreMintAmount] = useState<number>();
  const [publicMintStartDate, setPublicMintStartDate] = useState<Date>();
  const [publicMintStartTime, setPublicMintStartTime] = useState<string>();
  const [publicMintEndDate, setPublicMintEndDate] = useState<Date>();
  const [publicMintEndTime, setPublicMintEndTime] = useState<string>();
  const [royaltyPercentage, setRoyaltyPercentage] = useState<number>();
  const [publicMintLimitPerAccount, setPublicMintLimitPerAccount] = useState<number>(1);
  const [publicMintFeePerNFT, setPublicMintFeePerNFT] = useState<number>();

  const { collection, totalMinted = 0, maxSupply = 1 } = data ?? {};

  // Internal state
  const [isUploading, setIsUploading] = useState(false);

  // On create collection button clicked
  const onCreateCollection = async () => {
    try {
      if (!account) throw new Error("Please connect your wallet");
      if (!files) throw new Error("Please upload files");
      // if (account.address !== CREATOR_ADDRESS) throw new Error("Wrong account");
      if (isUploading) throw new Error("Uploading in progress");

      // Set internal isUploading state
      setIsUploading(true);

      // Upload collection files to Irys
      const { collectionName, collectionDescription, maxSupply, projectUri } = await uploadCollectionData(
        aptosWallet,
        files,
      );

      // Submit a create_collection entry function transaction
      const response = await signAndSubmitTransaction(
        createCollection({
          collectionDescription,
          collectionName,
          projectUri,
          maxSupply,
          royaltyPercentage,
          preMintAmount,
          allowList: undefined,
          allowListStartDate: undefined,
          allowListEndDate: undefined,
          allowListLimitPerAccount: undefined,
          allowListFeePerNFT: undefined,
          publicMintStartDate,
          publicMintEndDate,
          publicMintLimitPerAccount,
          publicMintFeePerNFT,
        }),
      );

      // Wait for the transaction to be commited to chain
      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      // Once the transaction has been successfully commited to chain, navigate to the `my-collection` page
      if (committedTransactionResponse.success) {
        toast({
          title: "Success",
          description: `Transaction succeeded, hash: ${committedTransactionResponse.hash}`,
        });
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNFT = async (e: FormEvent) => {
    e.preventDefault();
    if (!collection?.collection_id) return;

    const response = await signAndSubmitTransaction(
      mintNFT({ collectionId: collection.collection_id, amount: amount }),
    );
    await aptosClient().waitForTransaction({ transactionHash: response.hash });
    queryClient.invalidateQueries();
    setAmount(1);
  };

  const { account, signAndSubmitTransaction } = useWallet();
  
  return (
    <div className="bg-white rounded-none w-full shadow-md mx-auto border-2 border-black h-[460px] overflow-y-auto font-vt323">
      {location.pathname === "/dashboard" ? (
        <div className="p-3">
          <div className="rounded-sm">
            <img src={"/icons/nft.svg"} alt="NFT aptos" className="w-full h-auto max-h-40 object-contain mb-2 " />
          </div>
          // Collection Creation UI
          <div className="grid grid-cols-2 gap-4 text-start text-black">
            <DateTimeInput
              id="mint-start"
              label="Public mint start date"
              tooltip="When minting becomes active"
              disabled={isUploading || !account}
              date={publicMintStartDate}
              onDateChange={setPublicMintStartDate}
              time={publicMintStartTime}
              onTimeChange={() => setPublicMintStartTime}
            />
            <DateTimeInput
              id="mint-end"
              label="Public mint end date"
              tooltip="When minting finishes"
              disabled={isUploading || !account}
              date={publicMintEndDate}
              onDateChange={setPublicMintEndDate}
              time={publicMintEndTime}
              onTimeChange={() => setPublicMintEndTime}
            />

            <LabeledInput
              id="mint-limit"
              required
              label="Mint limit per address"
              tooltip="How many NFTs an individual address is allowed to mint"
              disabled={isUploading || !account}
              onChange={(e) => setPublicMintLimitPerAccount(parseInt(e.target.value))}
            />

            <LabeledInput
              id="for-myself"
              label="Mint for myself"
              tooltip="How many NFTs to mint immediately for the creator"
              disabled={isUploading || !account}
              onChange={(e) => setPreMintAmount(parseInt(e.target.value))}
            />
          </div>
          <ConfirmButton
            title="Create Collection"
            className="self-start w-full bg-red-600 mt-4"
            onSubmit={onCreateCollection}
            disabled={!account || !files?.length || !publicMintStartDate || !publicMintLimitPerAccount || isUploading}
            confirmMessage={
              <>
                <p>The upload process requires at least 2 message signatures</p>
                <ol className="list-decimal list-inside">
                  <li>To upload collection cover image file and NFT image files into Irys.</li>
                  <li>To upload collection metadata file and NFT metadata files into Irys.</li>
                </ol>
                <p>In the case we need to fund a node on Irys, a transfer transaction submission is required also.</p>
              </>
            }
          />
        </div>
      ) : (
        <div>
          <div className="rounded-sm">
            <img
              src={
                isCollectionCreated?.cdn_asset_uris?.cdn_image_uri ??
                "https://utfs.io/f/PKy8oE1GN2J3pihxJUVwi394rogIqdXzW56n8bYJTPQ1MAjv"
              }
              alt="NFT aptos"
              className="w-full h-auto max-h-40 object-contain mb-2 "
            />
          </div>
          <div className="flex flex-col gap-2 p-2 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-800">NFT Name</p>
              <p className="text-xl text-black font-bold ">{isCollectionCreated?.collection_name}</p>
              <p className="text-xs text-gray-800">{isCollectionCreated?.description}</p>
            </div>

            <div className="flex space-x-12 items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">Your Balance</p>
                <p className="text-xl text-black font-bold ">
                  {clampNumber(totalMinted)} / {clampNumber(maxSupply)} Minted
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">Total Supply</p>
                <p className="text-xl font-bold text-black">{maxSupply} Available</p>
              </div>
            </div>
          </div>
          <div className="px-1 py-2 flex flex-col">
            <Label className="text-black font-semibold">Quantity:</Label>
            <Input
              id="mint-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="flex-1 bg-transparent text-black rounded-none mt-1"
            />
            <button
              onClick={handleNFT}
              disabled={loading}
              className={`mt-3 text-black text-xl bg-transparent font-bold py-1 rounded-sm w-full border border-black transition duration-300 ${loading ? "bg-gradient-to-r from-[#58cc02] to-white animate-pulse" : ""} ${success ? "bg-[#89e219]" : ""}`}
            >
              {loading ? "Claiming..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Claim NFT"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFT;
