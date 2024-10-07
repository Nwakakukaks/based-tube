import React, { useState } from "react";
import DynamicMint from "./token";
import NFT from "./nft";
import { useNavigate } from "react-router-dom";

const Creator: React.FC = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [aptosAddress, setAptosAddress] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [currentStep, setCurrentStep] = useState(0); // Manage current step

  const renderInputForm = () => (
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
  );

  const BeginSetup = () => (
    <div className="text-center">
      <h2 className="text-2xl mb-4">Welcome to the Setup</h2>
      <button
        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        onClick={() => setCurrentStep(1)} // Move to Dynamic Mint step
      >
        Begin Setup
      </button>
    </div>
  );

  const generateSuperchatUrl = async () => {
    setLiveUrl(videoUrl)
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

  const steps = [
    { title: "Begin Setup", content: <BeginSetup /> },
    { title: "Create a contributor token", content: <DynamicMint /> },
    { title: "Create an NFT badge for contributors", content: <NFT /> },
    { title: "Input Video Link and Address", content: renderInputForm() },
  ];

  const handleLive = () => {
    if (liveUrl.trim()) {
      navigate("/live", { state: { message: liveUrl } });
    }
  };

  return (
    <div className="text-center bg-gray-100 p-4">
      <div className="flex space-x-1 items-center" onClick={handleLive}>
        <img src="" />
        <p>Enter Live</p>
      </div>
      <div className="">
        <h2 className="text-2xl mb-4 text-gray-800">{steps[currentStep].title}</h2>
        {steps[currentStep].content}
        <div className="flex justify-between mt-4">
          {currentStep < steps.length - 1 && (
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Creator;
