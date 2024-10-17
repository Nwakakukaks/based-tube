import React, { useEffect, useState } from "react";
import transactionsData from "../../../chatbot/validTransactions.json"; // Update with your actual path

interface Transaction {
  amount: string;
  videoId: string;
  timestamp: string;
  address: string;
  transactionHash: string;
  message: string;
}

// Utility function to shorten crypto addresses and hashes
const shortenString = (str: string, maxLength: number = 10): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, 5)}...${str.slice(-5)}`;
};

const Transactions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dataDisplay, setDataDisplay] = useState<Transaction[]>([]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setDataDisplay(transactionsData);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    
      <div className="analytics-dashboard mt-6 p-4 rounded-sm mx-auto">
        <h2 className="text-xl">Transactions</h2>

        {loading && <div className="loading-indicator text-center mt-4">Loading...</div>}

        {!loading && dataDisplay.length === 0 && (
          <div className="no-data text-center mt-4">No transactions found.</div>
        )}

        {!loading && dataDisplay.length > 0 && (
          <table className="min-w-full mt-4 border-2 border-gray-700 text-gray-200 overflow-y-auto">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border px-4 py-1">Amount</th>
                <th className="border px-4 py-1">Video ID</th>
                <th className="border px-4 py-1">Timestamp</th>
                <th className="border px-4 py-1">Sender</th>
                <th className="border px-4 py-1">Hash</th>
                <th className="border px-4 py-1">Message</th>
              </tr>
            </thead>
            <tbody>
              {dataDisplay.map((transaction) => (
                <tr key={transaction.transactionHash} className="bg-white text-black hover:bg-blue-100">
                  <td className="border px-4 py-2 text-sm">{transaction.amount}</td>
                  <td className="border px-4 py-2 text-sm">{transaction.videoId}</td>
                  <td className="border px-4 py-2 text-sm">{new Date(transaction.timestamp).toLocaleString()}</td>
                  <td className="border px-4 py-2 text-sm">{shortenString(transaction.address)}</td>
                  <td className="border px-4 py-2 text-sm">{shortenString(transaction.transactionHash)}</td>
                  <td className="border px-4 py-2 text-sm">{transaction.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    
  );
};

export default Transactions;
