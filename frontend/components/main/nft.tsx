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

const NFT = () => {
  // Wallet Adapter provider
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
    // if (!account || !data?.isMintActive) return;
    if (!collection?.collection_id) return;

    console.log("clicked");

    const response = await signAndSubmitTransaction(
      mintNFT({ collectionId: collection.collection_id, amount: amount }),
    );
    await aptosClient().waitForTransaction({ transactionHash: response.hash });
    queryClient.invalidateQueries();
    setAmount(1);
  };

  const { account, signAndSubmitTransaction } = useWallet();

  console.log(`collection map`, collections);
  return (
    <div className="bg-white rounded-none w-full shadow-md mx-auto border-2 border-black h-[460px] overflow-y-auto font-vt323">
      <div className="p-3">
        <div className="rounded-sm">
          <img
            src={"/icons/nft.svg"}
            alt="NFT aptos"
            className="w-full h-auto max-h-40 object-contain mb-2 "
          />
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
    </div>
  );
};

export default NFT;
