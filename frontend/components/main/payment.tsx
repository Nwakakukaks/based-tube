import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { paymentContract, paymentAbi } from "@/constants";

const Payment: React.FC = () => {
  const { address } = useAccount();
  const { writeContract, data: txHash } = useWriteContract();
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [videoId] = useState(new URLSearchParams(window.location.search).get("vid") || "");
  const [recipientAddress] = useState(new URLSearchParams(window.location.search).get("lnaddr") || "");

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const sendSuperchat = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
      return;
    }

    if (message && amount && recipientAddress) {
      setLoading(true);

      try {
        const amountInWei = parseEther(amount);

        await writeContract({
          address: paymentContract,
          abi: paymentAbi,
          functionName: "payment",
          args: [recipientAddress],
          value: amountInWei,
        });
      } catch (error) {
        console.error("Error sending payment:", error);
        toast({
          title: "Error",
          description: "Failed to send payment. Please try again.",
        });
        setLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
      });
    }
  };

  const showSuccessMessage = async () => {
    await generateClaimUrl();
    setSuccessMessage(`Your Superchat has been posted ⚡⚡`);
  };

  const generateClaimUrl = async () => {
    if (videoId && recipientAddress) {
      try {
        const response = await fetch("https://aptopus-backend.vercel.app/generate-short-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId, address: recipientAddress }),
        });
        const data = await response.json();

        if (data.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.error,
          });
        } else {
          const claimUrl = `${window.location.origin}/c/${data.shortCode}`;
          setGeneratedUrl(claimUrl);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `An error occurblue: ${error}`,
        });
      }
    } else {
      toast({
        variant: "default",
        title: "Claim Link Error",
        description: "Failed to generate Claim Link",
      });
    }
  };

  React.useEffect(() => {
    if (isConfirmed && txHash) {
      console.log("Transaction confirmed:", txHash);
      showSuccessMessage();
      setLoading(false);

      // Send message to backend
      fetch("https://aptopus-backend.vercel.app/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          amount,
          videoId,
          address: recipientAddress,
          hash: txHash,
        }),
      }).catch(console.error);

      toast({
        title: "Success",
        description: `Payment sent successfully! Transaction hash: ${txHash}`,
      });
    }
  }, [isConfirmed, txHash]);

  return (
    <div className="flex flex-col gap-3 justify-center items-center mx-auto h-[75vh]">
      <div className={`bg-white rounded-lg shadow-md px-6 py-12 w-[85%]`}>
        <h1 className="text-2xl text-blue-600">Superbase </h1>
        <Input
          name="message"
          placeholder="Enter your Superchat message"
          type="text"
          maxLength={220}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded p-2 mt-2 mb-4 text-gray-800"
        />
        <Input
          name="amount"
          placeholder="Amount in ETH"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded p-2 mt-2 mb-4 text-gray-800"
        />
        <Button
          id="send-superchat-button"
          onClick={sendSuperchat}
          disabled={loading || isConfirming}
          className={`w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded p-2 transition-all duration-300 ${
            loading || isConfirming ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading || isConfirming ? "Sending..." : "Send Superchat"}
        </Button>
      </div>

      {successMessage && (
        <div className="bg-white text-gray-900 rounded-md p-2 mt-1 w-[90%]">
          <h2 className="text-base font-semibold">Payment Successful!</h2>
          <p className="text-sm">{successMessage}</p>
          <p className="text-xs mt-2">
            Hurray! claim your token here:{" "}
            <a href={generatedUrl} className="text-blue-500">
              {generatedUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Payment;