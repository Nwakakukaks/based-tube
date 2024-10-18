import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Transaction {
  amount: string;
  videoId: string;
  timestamp: string;
  address: string;
  transactionHash: string;
  message: string;
}

const DisburseRewards = ({ videoId, transactions }: { videoId: string; transactions: Transaction[] }) => {
  const [status, setStatus] = useState<{ [key: string]: "pending" | "success" | "error" }>({});
  const uniqueAddresses = Array.from(new Set(transactions.map((t) => t.address)));
  const totalContributions = transactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="bg-white rounded-none w-full shadow-md mx-auto border-2 border-black font-vt323">
      <div className="h-6 bg-blue-500 w-full flex justify-between px-2">
        <p className="text-base font-semibold text-white">{videoId}</p>
        {/* <img src="https://utfs.io/f/PKy8oE1GN2J3JMeRo2HVozIYU8DFRWmkp7SC4bh16KiGHZfv" alt="Logo" /> */}
      </div>

      <div className="p-4 text-center">
        <Card>
          <CardHeader className="pb-3">
            <h2 className="text-lg font-bold">Stream Summary</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Contributors</p>
                <p className="text-2xl font-bold">{uniqueAddresses.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Contributions</p>
                <p className="text-2xl font-bold">{totalContributions.toFixed(3)} ETH</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-center">
              <h3 className="font-semibold">Contributors</h3>
              {uniqueAddresses.map((address) => (
                <div key={address} className="flex items-center justify-between p-2 border border-gray-200">
                  <span className="font-mono text-sm">{address}</span>
                  {status[address] && (
                    <span className="flex items-center">
                      {status[address] === "pending" && <Loader2 className="animate-spin h-4 w-4" />}
                      {status[address] === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {status[address] === "error" && <p className=" text-blue-500 text-sm font-semibold">Failed </p>}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisburseRewards;
