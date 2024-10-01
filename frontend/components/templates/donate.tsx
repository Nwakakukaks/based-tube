import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";

const Donate: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const predefinedAmounts: number[] = [10, 50, 100];

  const handlePredefinedDonation = (amount: number): void => {
    setDonationAmount(amount.toString());
    handleDonation(amount);
  };

  const handleDonation = async (amount: number): Promise<void> => {
    setLoading(true);
    setSuccess(false);

    const recipient = "0x53FA684bDd93da5324BDc8B607F8E35eC79ccF5A";
    const tokenAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381"; // replace with token address
    const decimals = 18; // replace with token decimals

    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("Sending transaction");
        const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
        const publicKey: string = accounts[0];
        const amountToSend: string = (amount * Math.pow(10, decimals)).toString(16);

        const data: string = "0xa9059cbb" + recipient.substring(2).padStart(64, "0") + amountToSend.padStart(64, "0");
        const transactionParameters = {
          to: tokenAddress,
          from: publicKey,
          data: data,
        };

        const txHash: string = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        checkTransactionStatus(txHash);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    } else {
      alert("MetaMask is not installed");
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (hash: string): Promise<void> => {
    const receipt: any = await window.ethereum.request({
      method: "eth_getTransactionReceipt",
      params: [hash],
    });

    if (receipt && receipt.blockNumber) {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDonationAmount("");
      }, 3000);
    } else {
      setTimeout(() => checkTransactionStatus(hash), 1000);
    }
  };

  const handleClick = (): void => {
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    handleDonation(amount);
  };

  return (
    <div>
      <p className="text-lg font-medium text-gray-400 ">Donation Template</p>

      <div className="relative bg-white rounded-none p-4 w-full max-w-md shadow-md h-[460px]">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3NcDS9MmqTwZLGavY36FuE8XmyPAoRIOJCQBK"
          alt="Background Image"
          className="w-full h-auto max-h-52 rounded-sm mb-2"
        />
        <div className=" py-2 px-1 flex flex-col gap-2">
        <Label className="text-gray-700">Donate to cause:</Label>
          <div className="flex items-center border border-gray-300 rounded-none p-2">
            <img
              src="https://utfs.io/f/PKy8oE1GN2J3ovmAor45P1iTwAUWSgurlXmB0cxH485C3q2s"
              alt="APTOS"
              className="w-5 h-5 mr-2"
            />
            <Input
              name="donationAmount"
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 bg-transparent focus:outline-none placeholder:text-sm rounded-none text-gray-800"
            />
          </div>
          <Button
            onClick={handleClick}
            disabled={loading}
            className={`bg-teal-500 text-white font-bold py-2 rounded-sm w-full transition duration-300 ${loading ? "bg-gradient-to-r from-teal-400 to-pink-400 animate-pulse" : ""} ${success ? "bg-green-500" : ""}`}
          >
            {loading ? "Donating..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Donate APTOS"}
          </Button>
          <div className="flex justify-between mt-2">
            {predefinedAmounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => handlePredefinedDonation(amount)}
                className="flex-1 mx-1 bg-teal-300 text-teal-800 text-xs hover:text-white font-semibold p-1 rounded-sm"
              >
                Donate {amount}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
