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
    <div className="text-center bg-gray-100 p-4 text-gray-800">
      <div className="analytics-dashboard mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-2xl">Transactions</h2>

        {loading && <div className="loading-indicator text-center mt-4">Loading...</div>}

        {!loading && dataDisplay.length === 0 && (
          <div className="no-data text-center mt-4">No transactions found.</div>
        )}

        {!loading && dataDisplay.length > 0 && (
          <table className="min-w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Video ID</th>
                <th className="border px-4 py-2">Timestamp</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Transaction Hash</th>
                <th className="border px-4 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {dataDisplay.map((transaction) => (
                <tr key={transaction.transactionHash} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{transaction.amount}</td>
                  <td className="border px-4 py-2">{transaction.videoId}</td>
                  <td className="border px-4 py-2">{new Date(transaction.timestamp).toLocaleString()}</td>
                  <td className="border px-4 py-2">{shortenString(transaction.address)}</td>
                  <td className="border px-4 py-2">{shortenString(transaction.transactionHash)}</td>
                  <td className="border px-4 py-2">{transaction.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;
