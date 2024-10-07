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

// Group transactions by video ID
const groupTransactionsByVideoId = (transactions: Transaction[]) => {
  return transactions.reduce((acc: Record<string, Transaction[]>, transaction) => {
    if (!acc[transaction.videoId]) {
      acc[transaction.videoId] = [];
    }
    acc[transaction.videoId].push(transaction);
    return acc;
  }, {});
};

const Streams: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [groupedStreams, setGroupedStreams] = useState<Record<string, Transaction[]>>({});

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      const groupedData = groupTransactionsByVideoId(transactionsData);
      setGroupedStreams(groupedData);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate summary for individual streams
  const calculateStreamSummary = (transactions: Transaction[]) => {
    let totalAmount = 0;
    const uniqueAddresses = new Set<string>();

    transactions.forEach((transaction) => {
      totalAmount += parseFloat(transaction.amount);
      uniqueAddresses.add(transaction.address);
    });

    return {
      totalAmount,
      totalContributors: uniqueAddresses.size,
      contributors: Array.from(uniqueAddresses),
    };
  };

  const handleDisburseRewards = (contributors: string[]) => {
    // Logic for disbursing rewards
    console.log("Disbursing rewards to:", contributors);
  };

  return (
    <div className="text-center bg-gray-100 p-4 text-gray-800">
      <div className="analytics-dashboard mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-2xl">Past Streams</h2>

        {loading && <div className="loading-indicator text-center mt-4">Loading...</div>}

        {!loading && Object.keys(groupedStreams).length === 0 && (
          <div className="no-data text-center mt-4">No past streams found.</div>
        )}

        {!loading && Object.keys(groupedStreams).length > 0 && (
          <div className="mt-4">
            {Object.entries(groupedStreams).map(([videoId, transactions]) => {
              const { totalAmount, totalContributors, contributors } = calculateStreamSummary(transactions);

              return (
                <div key={videoId} className="mb-4">
                  <h3 className="text-lg font-semibold">Video ID: {videoId}</h3>
                  <div className="summary mb-2">
                    <p>Total Amount Received: {totalAmount.toFixed(3)} ETH</p>
                    <p>Total Contributors: {totalContributors}</p>
                    <button
                      onClick={() => handleDisburseRewards(contributors)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Disburse Rewards
                    </button>
                  </div>
                  <table className="min-w-full mt-2 border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Amount</th>
                        <th className="border px-4 py-2">Timestamp</th>
                        <th className="border px-4 py-2">Address</th>
                        <th className="border px-4 py-2">Transaction Hash</th>
                        <th className="border px-4 py-2">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.transactionHash} className="hover:bg-gray-100">
                          <td className="border px-4 py-2">{transaction.amount}</td>
                          <td className="border px-4 py-2">{new Date(transaction.timestamp).toLocaleString()}</td>
                          <td className="border px-4 py-2">{shortenString(transaction.address)}</td>
                          <td className="border px-4 py-2">{shortenString(transaction.transactionHash)}</td>
                          <td className="border px-4 py-2">{transaction.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Streams;
