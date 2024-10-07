import React, { useState } from "react";

const Streams: React.FC = () => {

  const [liveUrl, setLiveUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataDisplay, setDataDisplay] = useState<any[]>([]);

  return (
    <div className="text-center bg-gray-100 p-4">
      <div className="analytics-dashboard mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-2xl">Creator Dashboard</h2>
        <div className="flex justify-around mt-4">
          <div className="analytics-input-box text-black">
            <h3 className="text-xl">Live chat data</h3>
            <p>Start monitoring your live chat to see superchats and payments show up here in real-time.</p>
            <div className="flex mt-2">
              <input
                type="text"
                placeholder="Insert URL"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button className="analytics-button ml-2 bg-red-600 text-white p-2 rounded" >
                Submit
              </button>
            </div>
          </div>
        </div>

        {loading && <div className="loading-indicator text-center mt-4">Loading...</div>}
        {dataDisplay.length > 0 && (
          <div className="data-display mt-4">
            <h4 className="text-xl">Fetched Messages:</h4>
            <ul>
              {dataDisplay.map((message, index) => (
                <li key={index} className="mt-2">
                  {message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Streams;
