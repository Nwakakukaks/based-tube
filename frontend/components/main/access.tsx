import { useEffect, useMemo, useState } from "react";
import { useGetAssetData } from "@/hooks/useGetAssetData";
import { useGetAssetMetadata } from "@/hooks/useGetAssetMetadata";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "@/components/ui/use-toast";
import { getTokenBalance } from "@/view-functions/getTokenBalance";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const Access = () => {
  const fas = useGetAssetMetadata();
  const { account, signMessageAndVerify } = useWallet();
  const [loadingStates, setLoadingStates] = useState<Record<string, string | null>>({});
  const [signedPlatform, setSignedPlatform] = useState<{ name: string; requiredBalance: number } | null>(null);

  const lastAssetType = useMemo(() => {
    if (fas.length > 0) {
      return fas[fas.length - 1].asset_type;
    }
    return "";
  }, [fas]);

  const FA_ADDRESS = lastAssetType;
  const { data: assetData } = useGetAssetData(FA_ADDRESS);
  const { asset } = assetData ?? {};

  const platforms = [
    { name: "Patreon", requiredBalance: 1 },
    { name: "YouTube", requiredBalance: 1 },
    { name: "Medium", requiredBalance: 1 },
    { name: "Substack", requiredBalance: 1 },
    { name: "Instagram", requiredBalance: 1 },
    { name: "Farcaster", requiredBalance: 1 },
  ];

  const generateRandomString = (prefix: any, length = 8) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `${prefix}-${randomString}`;
  };

  const { data: balanceData, refetch: fetchBalance } = useQuery({
    queryKey: ["token-balance", account?.address],
    queryFn: async () => {
      try {
        if (!account?.address || !asset?.asset_type) {
          console.log("Account or asset not available");
          return { balance: 0 };
        }

        const balance = await getTokenBalance({
          accountAddress: account.address,
          fa_obj: asset.asset_type,
        });
        
        return { balance };
      } catch (error) {
        console.error('Balance fetch error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error fetching balance",
        });
        return { balance: 0 };
      }
    },
    enabled: false,
  });

  useEffect(() => {
    const checkBalanceAndGrant = async () => {
      if (signedPlatform && balanceData) {
        // Assuming the token has 8 decimals - you might want to fetch this from the asset metadata
        const tokenBalance = balanceData.balance / Math.pow(10, 8);

        if (tokenBalance >= signedPlatform.requiredBalance) {
          const passkey = generateRandomString(signedPlatform.name);
          toast({
            title: "Access Granted",
            description: `You now have access to exclusive content on ${signedPlatform.name}! Your passkey: ${passkey}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: `You need at least ${signedPlatform.requiredBalance} creator token to access ${signedPlatform.name} contents.`,
          });
        }

        setLoadingStates((prev) => ({ ...prev, [signedPlatform.name]: null }));
        setSignedPlatform(null);
      }
    };

    checkBalanceAndGrant();
  }, [balanceData, signedPlatform]);

  const handleAccess = async (platform: { name: string; requiredBalance: number }) => {
    const message = "Search wallet holdings for creator token";
    
    setLoadingStates((prev) => ({ ...prev, [platform.name]: "accessing" }));
    
    try {
      const data = await signMessageAndVerify({ message, nonce: "" });
      
      if (data) {
        setLoadingStates((prev) => ({ ...prev, [platform.name]: "checking" }));
        setSignedPlatform(platform);
        await fetchBalance();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify wallet signature",
      });
      setLoadingStates((prev) => ({ ...prev, [platform.name]: null }));
    }
  };

  const getButtonText = (platform: { name: string; requiredBalance?: number }) => {
    switch (loadingStates[platform.name]) {
      case "accessing":
        return "Accessing wallet tokens...";
      case "checking":
        return "Checking for creator token...";
      default:
        return ` ${platform.name}`;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Access Creator Exclusive Contents</h1>
      <p className="mb-4">Connect your wallet to access exclusive contents using your membership token</p>
      <div className="grid grid-cols-1 gap-4">
        {platforms.map((platform) => (
          <Button
            key={platform.name}
            onClick={() => handleAccess(platform)}
            className="w-full"
            disabled={!!loadingStates[platform.name]}
          >
            {getButtonText(platform)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Access;