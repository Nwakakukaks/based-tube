import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const NFT = () => {
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
      <p className="text-lg font-medium text-gray-400 ">NFT Template</p>

      <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px]">
        <div className="bg-[#313939] rounded-sm">
          <img
            src="https://utfs.io/f/PKy8oE1GN2J3pihxJUVwi394rogIqdXzW56n8bYJTPQ1MAjv"
            alt="NFT aptos"
            className="w-full h-auto max-h-52 object-contain mb-4 rounded-lg"
          />
        </div>

        <div className=" px-1 py-2 flex flex-col ">
          <div>
            <Label className="text-gray-700">Mint to:</Label>
            <Input
              name="address"
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 bg-transparent  text-black rounded-none"
            />
          </div>
          <div className="mt-1">
            <Label className="text-gray-700">Quantity:</Label>
            <Input
              name="amount"
              type="number"
              placeholder="Quantity to Mint"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent  text-black rounded-none"
            />
          </div>

          <Button
            onClick={handleNFT}
            disabled={loading}
            className={`mt-3 bg-teal-500 text-white font-bold py-3 rounded-sm w-full transition duration-300 ${loading ? "bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse" : ""} ${success ? "bg-green-500" : ""}`}
          >
            {loading ? "Minting..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Mint NFT"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NFT;
