import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Mint = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMint = async () => {
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
      <p className="text-lg font-medium text-gray-400 ">Mint Template</p>
      <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px]">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3w6bQu3oTGjD39YCQS6grBNLTs0O8fHmZ51cK"
          alt="Mint aptos"
          className="w-full h-auto max-h-[150px] object-contain mb-4"
        />
        <div className=" py-2 px-1 flex flex-col mt-2">
          <div className="flex space-x-2 mt-2">
            <div className="flex flex-col w-full">
              <Label className="text-gray-700 mb-1">Token Name:</Label>
              <Input
                name="name"
                type="text"
                placeholder="Enter Name"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent  text-black rounded-none"
              />
            </div>

            <div className="flex flex-col w-full">
              <Label className="text-gray-700 mb-1">Token Symbol:</Label>
              <Input
                name="symbol"
                type="text"
                placeholder="Enter Symbol"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent  text-black rounded-none"
              />
            </div>
          </div>

          <div className="mt-1">
            <Label className="text-gray-700">Mint to:</Label>
            <Input
              name="address"
              type="text"
              placeholder="Enter Address"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
            onClick={handleMint}
            disabled={loading}
            className={`mt-3 bg-teal-500 text-white font-bold py-3 rounded-sm w-full transition duration-300 ${loading ? "bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse" : ""} ${success ? "bg-green-500" : ""}`}
          >
            {loading ? "Minting..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Mint Token"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mint;
