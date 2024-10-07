import React, { useEffect, useState } from "react";
import transactionsData from "../../../chatbot/validTransactions.json"; // Update with your actual path
import DisburseRewards from "./disbursereward";

interface Transaction {
  amount: string;
  videoId: string;
  timestamp: string;
  address: string;
  transactionHash: string;
  message: string;
}


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
    const timer = setTimeout(() => {
      const groupedData = groupTransactionsByVideoId(transactionsData);
      setGroupedStreams(groupedData);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



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
              return (
                <div key={videoId} className="mb-4">
                  <DisburseRewards videoId={videoId} transactions={transactions} />
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
