import React, { useState, useRef, FormEvent, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAssetData } from "@/hooks/useGetAssetData";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { mintAsset } from "@/entry-functions/mint_asset";
import { aptosClient } from "@/utils/aptosClient";
import { useQueryClient } from "@tanstack/react-query";

// Internal utils
import { checkIfFund, uploadFile } from "@/utils/Irys";
import { createAsset } from "@/entry-functions/create_asset";
import { useGetAssetMetadata } from "@/hooks/useGetAssetMetadata";
import { toast } from "@/hooks/use-toast";
// import { toast } from "../ui/use-toast";

const DynamicMint = () => {
  const fas = useGetAssetMetadata();

  // Get the last asset_type
  const lastAssetType = useMemo(() => {
    if (fas.length > 0) {
      return fas[fas.length - 1].asset_type;
    }
    return "";
  }, [fas]);

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    decimals: "",
    icon_uri: "",
    project_uri: "",
    mint_fee_per_smallest_unit_of_fa: "",
    pre_mint_amount: "",
    mint_limit_per_addr: "",
    max_supply: "",
    mintTo: "",
    quantity: "",
  });

  const queryClient = useQueryClient();
  const { account, signAndSubmitTransaction } = useWallet();
  const aptosWallet = useWallet();

  const [tokenHash, setTokenHash] = useState<string>("");
  let FA_ADDRESS = lastAssetType;

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | undefined>();
  const { data } = useGetAssetData(FA_ADDRESS);

  const [isUploading, setIsUploading] = useState(false);

  const { asset, userMintBalance = 0, yourBalance = 0, maxSupply = 0, currentSupply = 0 } = data ?? {};

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
          setFormData((prev) => ({ ...prev, icon_uri: file.name }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Create Asset Function
  const onCreateAsset = async () => {
    try {
      if (!account) throw new Error("Connect wallet first");
      if (!image) throw new Error("Select image first");

      setIsUploading(true);

      // Check if the account has enough funds
      const funded = await checkIfFund(aptosWallet, image.size);
      if (!funded) throw new Error("Current account balance is not enough to fund a decentralized asset node");

      // Upload the asset file to Irys
      const iconURL = await uploadFile(aptosWallet, image);

      // Submit createAsset transaction
      const response = await signAndSubmitTransaction(
        createAsset({
          maxSupply: Number(formData.max_supply),
          name: formData.name,
          symbol: formData.symbol,
          decimal: Number(formData.decimals),
          iconURL,
          projectURL: formData.project_uri,
          mintFeePerFA: Number(formData.mint_fee_per_smallest_unit_of_fa),
          mintForMyself: Number(formData.pre_mint_amount), // Check if pre-minting
          maxMintPerAccount: Number(formData.mint_limit_per_addr),
        }),
      );

      // Wait for the transaction to be committed to the chain
      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      setTokenHash(response.hash);

      if (committedTransactionResponse.success) {
        toast({
          title: "Success",
          description: `Transaction succeeded, hash: ${committedTransactionResponse.hash}`,
        });
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Mint Function
  const mintFA = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!account) {
      return setError("Please connect your wallet");
    }

    if (!asset) {
      return setError("Asset not found");
    }

    if (!data?.isMintActive) {
      return setError("Minting is not available");
    }

    const amount = parseFloat(formData.quantity);
    if (Number.isNaN(amount) || amount <= 0) {
      return setError("Invalid amount");
    }

    const response = await signAndSubmitTransaction(
      mintAsset({
        assetType: asset.asset_type,
        amount,
        decimals: asset.decimals,
      }),
    );

    await aptosClient().waitForTransaction({ transactionHash: response.hash });
    queryClient.invalidateQueries();
  };

  const isCreatingToken = !asset;

  useEffect(() => {}, [tokenHash]);

  console.log(tokenHash);

  return (
    <div className="bg-white rounded-none w-full shadow-md mx-auto border-2 border-black h-[460px] font-vt323 overflow-y-auto">
      <div className="p-4">
        <div className=" flex  items-center justify-center rounded-sm">
          <img
            src={previewImage ? previewImage : "/icons/upload.svg"}
            alt={`icon`}
            className=" max-w-24 h-auto max-h-40 object-contain mb-4 rounded-full overflow-hidden"
          />
        </div>

        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter token name"
              />
            </div>
            <div>
              <Label htmlFor="symbol">Token Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                placeholder="Enter token symbol"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="decimals">Decimals</Label>
            <Input
              id="decimals"
              name="decimals"
              type="number"
              value={formData.decimals}
              onChange={handleInputChange}
              placeholder="Enter number of decimal places"
            />
          </div>

          <div>
            <Label htmlFor="icon_upload">Token Icon</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center text-black"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Icon
              </Button>
              <Input
                id="icon_upload"
                name="icon_upload"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 my-3">
            <Checkbox id="advanced" checked={showAdvanced} onCheckedChange={() => setShowAdvanced(!showAdvanced)} />
            <Label htmlFor="advanced" className="text-black">Show advanced options</Label>
          </div>

          {showAdvanced && (
            <div className="space-y-4 border-t pb-4">
              {/* <div>
                <Label htmlFor="project_uri">Project URI</Label>
                <Input
                  id="project_uri"
                  name="project_uri"
                  value={formData.project_uri}
                  onChange={handleInputChange}
                  placeholder="Enter project URI"
                />
              </div> */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mint_fee_per_smallest_unit_of_fa">Mint Fee</Label>
                  <Input
                    id="mint_fee_per_smallest_unit_of_fa"
                    name="mint_fee_per_smallest_unit_of_fa"
                    type="number"
                    value={formData.mint_fee_per_smallest_unit_of_fa}
                    onChange={handleInputChange}
                    placeholder="Mint fee per smallest unit"
                  />
                </div>
                <div>
                  <Label htmlFor="pre_mint_amount">Pre-mint Amount</Label>
                  <Input
                    id="pre_mint_amount"
                    name="pre_mint_amount"
                    type="number"
                    value={formData.pre_mint_amount}
                    onChange={handleInputChange}
                    placeholder="Enter pre-mint amount"
                  />
                </div>
              </div> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mint_limit_per_addr">Mint Limit per Address</Label>
                  <Input
                    id="mint_limit_per_addr"
                    name="mint_limit_per_addr"
                    type="number"
                    value={formData.mint_limit_per_addr}
                    onChange={handleInputChange}
                    placeholder="Mint limit per address"
                  />
                </div>
                <div>
                  <Label htmlFor="max_supply">Max Supply</Label>
                  <Input
                    id="max_supply"
                    name="max_supply"
                    type="number"
                    value={formData.max_supply}
                    onChange={handleInputChange}
                    placeholder="Enter max supply (optional)"
                  />
                </div>
              </div>
            </div>
          )}
          <Button
            onClick={onCreateAsset}
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-gradient-to-r from-red-600 to-white animate-pulse"
                : success
                  ? "bg-red-600"
                  : "bg-red-600 hover:bg-red-400"
            } text-white font-bold py-2 px-4 rounded`}
          >
            {loading ? "Processing..." : success ? "✓ Done!" : "Create Token" }
          </Button>
        </>
      </div>
    </div>
  );
};

export default DynamicMint;
