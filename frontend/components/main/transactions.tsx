import React, { useState } from "react";

const Transactions: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [aptosAddress, setAptosAddress] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataDisplay, setDataDisplay] = useState<any[]>([]);

  const generateSuperchatUrl = async () => {
    const videoId = extractVideoId(videoUrl);
    if (videoId && aptosAddress) {
      try {
        const response = await fetch("/api/generate-short-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId, address: aptosAddress }),
        });
        const data = await response.json();

        if (data.error) {
          alert(data.error);
        } else {
          const superchatUrl = `${window.location.origin}/s/${data.shortCode}`;
          setGeneratedUrl(superchatUrl);
        }
      } catch (error) {
        alert(`Error: ${error}`);
      }
    } else {
      alert("Invalid input. Please enter a valid YouTube Live URL and Aptos Address.");
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="left-column p-6">
          <h1 className="text-6xl text-pink-500">Creator 🐙</h1>
          <h2 className="text-4xl mt-4">Aptos Superchat for Creators</h2>
          <h3 className="text-gray-600 mt-2">Monetize your live streams with Aptos Network. Keep your 30%!</h3>
          <div className="mt-6 flex justify-around">
            <div className="feature p-4 bg-white rounded-lg shadow-lg">
              <h4 className="text-pink-700 text-xl">Instant Payments</h4>
              <p>Receive payments and superchats in real-time directly in stream using the Aptos Network.</p>
            </div>
            <div className="feature p-4 bg-white rounded-lg shadow-lg">
              <h4 className="text-pink-700 text-xl">Easy Setup</h4>
              <p>
                Input your YouTube Live URL and Aptos address, then share the generated link with your viewers on your
                live.
              </p>
            </div>
          </div>
        </div>

        <div className="right-column p-6 text-black">
          <div className="form-container bg-gray-200 rounded-lg p-6 shadow-lg">
            <h1 className="text-2xl text-red-600">Create your Creator link</h1>
            <p>Generate a unique URL and pin it in your live chat</p>
            <input
              type="text"
              placeholder="Enter your YouTube Live URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="mt-4 p-2 border rounded text-gray-900"
            />
            <input
              type="text"
              placeholder="Enter your Aptos address"
              value={aptosAddress}
              onChange={(e) => setAptosAddress(e.target.value)}
              className="mt-4 p-2 border rounded text-gray-900"
            />
            <button
              className="submit-button mt-4 bg-red-600 text-white p-2 rounded hover:bg-red-700"
              onClick={generateSuperchatUrl}
            >
              Generate Creator Link
            </button>
            {generatedUrl && (
              <div className="generated-url mt-4 p-4 bg-white rounded shadow text-gray-900">
                <p>
                  Your generated URL:{" "}
                  <a href={generatedUrl} target="_blank" className="text-blue-500 underline">
                    {generatedUrl}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

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

export default Transactions;
