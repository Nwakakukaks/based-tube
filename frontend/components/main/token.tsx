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

  useEffect(() => {
    // Data or tokenHash dependency logic can go here
  }, [tokenHash]);

  console.log(tokenHash);

  return (
    <div className="bg-white rounded-none w-full shadow-md mx-auto border-2 border-black h-[460px] font-vt323 overflow-y-auto">
      <div className="h-6 bg-[#89e219] w-full flex justify-between px-2">
        <p className="text-base font-semibold text-black">Token Template</p>
        <img src="https://utfs.io/f/PKy8oE1GN2J3JMeRo2HVozIYU8DFRWmkp7SC4bh16KiGHZfv" alt="Logo" />
      </div>

      <div className="p-4">
        <div className=" flex  items-center justify-center rounded-sm">
          <img
            src={
              asset?.icon_uri ? asset.icon_uri : "https://utfs.io/f/PKy8oE1GN2J3w6bQu3oTGjD39YCQS6grBNLTs0O8fHmZ51cK"
            }
            alt={`${asset?.name} icon`}
            className=" max-w-24 h-auto max-h-40 object-contain mb-4 rounded-full overflow-hidden"
          />
        </div>

        {isCreatingToken ? (
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
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex items-center">
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
                {previewImage && (
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={previewImage} alt="Token Icon Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="advanced" checked={showAdvanced} onCheckedChange={() => setShowAdvanced(!showAdvanced)} />
              <Label htmlFor="advanced">Show advanced options</Label>
            </div>

            {showAdvanced && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <Label htmlFor="project_uri">Project URI</Label>
                  <Input
                    id="project_uri"
                    name="project_uri"
                    value={formData.project_uri}
                    onChange={handleInputChange}
                    placeholder="Enter project URI"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
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
                  ? "bg-gradient-to-r from-[#58cc02] to-white animate-pulse"
                  : success
                    ? "bg-[#89e219]"
                    : "bg-[#89e219] hover:bg-[#58cc02]"
              } text-white font-bold py-2 px-4 rounded`}
            >
              {loading ? "Processing..." : success ? "✓ Done!" : isCreatingToken ? "Create Token" : "Mint Token"}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex flex-col gap-6">
                <div>
                  <Label htmlFor="quantity" className=" font-medium text-black text-lg">
                    Quantity to Mint
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity to mint"
                    className="bg-transparent text-black rounded-none mt-1"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 p-2 rounded-lg">
               

                <div className="flex space-x-3 items-center text-start justify-between">

                <div>
                  <p className="font-medium text-gray-700">Mint Limit</p>
                  <p className="text-xl font-bold text-black ">
                    {Math.min(userMintBalance, maxSupply - currentSupply)}
                    <span className=" font-medium text-gray-900 ml-1">{asset?.symbol}</span>
                  </p>
                  <p className="text-xs text-gray-700">Maximum to mint</p>
                </div>

                  <div>
                    <p className="font-medium text-gray-700">Your Balance</p>
                    <p className="text-xl font-bold text-black ">
                      {yourBalance}
                      <span className=" font-medium text-gray-900 ml-1">{asset?.symbol}</span>
                    </p>
                    <p className="text-xs text-gray-700">Your Balance</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700">Total Supply</p>
                    <p className="text-xl font-bold text-black ">
                      {currentSupply} / {maxSupply}
                    </p>
                    <p className="text-xs text-gray-700">Minted/Max Supply</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  onClick={mintFA}
                  disabled={loading}
                  className={`w-full ${
                    loading
                      ? "bg-gradient-to-r from-[#58cc02] to-white animate-pulse"
                      : success
                        ? ""
                        : ""
                  } text-black text-xl font-bold py-1 px-4 rounded border border-black `}
                >
                  {loading ? "Minting..." : success ? "✓ Minted Successfully!" : "Mint Tokens"}
                </button>

                <div className="flex justify-between items-center text-gray-900">
                  <span>Token Address:</span>
                  <a
                    className="text-blue-500 hover:underline truncate max-w-[200px]"
                    target="_blank"
                    href={`https://explorer.aptoslabs.com/account/${asset?.asset_type}?network=testnet`}
                    rel="noopener noreferrer"
                  >
                    {asset?.asset_type}
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicMint;
