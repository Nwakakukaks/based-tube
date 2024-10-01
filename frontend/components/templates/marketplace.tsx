import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Marketplace = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNFT = async () => {
    setLoading(true);
    setSuccess(false);

    // Simulating the bridging process
    await new Promise((resolve) => setTimeout(resolve, 5000));

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setAmount("");
    }, 3000);
  };

  return (
    <div>
      <p className="text-lg font-medium text-gray-400 ">NFT Marketplace Template</p>
      <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px]">
        <div className="grid grid-cols-2 gap-2">
          <img
            src="https://utfs.io/f/PKy8oE1GN2J3ImEUxfLevETDAcJq1nugYV4XWR2yULbo7PO9"
            alt="NFT aptos"
            className="w-full h-36 object-cover rounded-sm"
          />
          <img
            src="https://utfs.io/f/PKy8oE1GN2J3KOWGsVvRh3M9zZEHBsUJXb2rmgqjVN7dGF0A"
            alt="NFT aptos"
            className="w-full h-36 object-cover rounded-sm"
          />
          <img
            src="https://utfs.io/f/PKy8oE1GN2J34Ea4iszOtmS4gyWw60ueoFxcn1br78fIZYvJ"
            alt="NFT aptos"
            className="w-full h-36 object-cover rounded-sm"
          />
          <img
            src="https://utfs.io/f/PKy8oE1GN2J3SBvM9TJRHgldbCZqO68FamQULKyreIx24zPN"
            alt="NFT aptos"
            className="w-full h-36 object-cover rounded-sm"
          />
        </div>

        <div className="rounded-none py-2 flex flex-col">
          <div className="mt-1">
            <Label className="text-gray-700">Quantity:</Label>
            <Input
              name="amount"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-black rounded-none"
            />
          </div>

          <Button
            onClick={handleNFT}
            disabled={loading}
            className={`mt-3 bg-teal-500 text-white font-bold py-3 rounded-sm w-full transition duration-300 ${loading ? "bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse" : ""} ${success ? "bg-green-500" : ""}`}
          >
            {loading ? "Purchasing..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Purchase NFT"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
