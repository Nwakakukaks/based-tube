import React, { useState } from "react";

const Live: React.FC = () => {
  const [liveUrl, setLiveUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataDisplay, setDataDisplay] = useState<any[]>([]);

  const extractVideoId = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
        if (parsedUrl.pathname.startsWith("/live/")) {
          return parsedUrl.pathname.split("/")[2];
        } else if (parsedUrl.searchParams.has("v")) {
          return parsedUrl.searchParams.get("v");
        } else if (hostname === "youtu.be") {
          return parsedUrl.pathname.slice(1);
        }
      }
    } catch (error) {
      console.error("Error parsing URL:", error);
    }
    return null;
  };

  const submitLiveUrl = async () => {
    const videoId = extractVideoId(liveUrl);
    if (videoId) {
      try {
        const response = await fetch("/api/start-monitoring", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId }),
        });
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          alert("Live URL submitted: " + liveUrl);
        }
      } catch (error) {
        alert("Error submitting live URL: " + error);
      }
    } else {
      alert("Please enter a valid URL.");
    }
  };

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
              <button className="analytics-button ml-2 bg-red-600 text-white p-2 rounded" onClick={submitLiveUrl}>
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

export default Live;
