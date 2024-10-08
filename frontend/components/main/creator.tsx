import React, { useState } from "react";
import DynamicMint from "./token";
// import NFT from "./nft";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CopyIcon } from "lucide-react";

const Creator: React.FC = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [aptosAddress, setAptosAddress] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [currentStep, setCurrentStep] = useState(0); // Manage current step

  const handleStreams = () => {
    navigate("/streams");
  };

  const handleTransactions = () => {
    navigate("/transactions");
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(generatedUrl)
      .then(() => {
        toast({
          variant: "default",
          title: "Link copied",
          description: "Creator link copied successfully!",
        });
      })
      .catch((error) => {
        console.error("Error copying the link: ", error);
      });
  };

  const renderInputForm = () => (
    <div className="flex justify-center items-center mt-10">
      <div className="border-2 border-gray-500 flex flex-col justify-center items-center gap-2 rounded-sm px-4 py-12 shadow-lg w-[90%]">
        <h1 className="text-2xl text-red-600">Generate Your Unique Link</h1>
        <p>Generate a unique URL and pin it in your live chat</p>

        <div className="flex space-x-4 w-[90%]">
          <Input
            type="text"
            placeholder="Enter your YouTube Live URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-4 p-2 border rounded-sm text-gray-800"
          />
          <Input
            type="text"
            placeholder="Enter your Aptos address"
            value={aptosAddress}
            onChange={(e) => setAptosAddress(e.target.value)}
            className="mt-4 p-2 border rounded-sm text-gray-800"
          />
        </div>

        <Button
          className="submit-button mt-4 bg-red-600 text-white p-2 rounded hover:bg-red-700 w-[90%]"
          onClick={generateSuperchatUrl}
        >
          Generate Creator Link
        </Button>
        {generatedUrl && (
          <div className="flex space-x-3 items-center justify-center mt-4 p-4 bg-white rounded-sm shadow text-gray-900 w-[90%]">
            <p className="text-sm text-center">
              Your generated URL:{" "}
              <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 underline">
                {generatedUrl}
              </a>
            </p>

            <button onClick={copyLink}>
              <CopyIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 mt-8 w-[90%]">
          <Card
            onClick={handleStreams}
            className="bg-transparent text-gray-400 border-gray-600 border-2 rounded-sm mt-2 w-full cursor-pointer "
          >
            <CardContent className="flex items-center justify-center space-x-3 mt-3">
              <div className="flex items-center">
                <img src="/icons/wallet.svg" className="h-14 w-14 p-2 rounded-sm mx-auto" />
              </div>
              <p className="text-gray-100 text-lg font-medium"> Past streams</p>
            </CardContent>
          </Card>

          <Card
            onClick={handleTransactions}
            className="bg-transparent text-gray-400 border-gray-600 border-2 rounded-sm mt-2 w-full cursor-pointer"
          >
            <CardContent className="flex space-x-3 items-center justify-center mt-3">
              <div className="flex items-center">
                <img src="/icons/member.svg" className="h-14 w-14 p-2 rounded-sm mx-auto" />
              </div>
              <p className="text-gray-100 text-lg font-medium"> Transactions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const BeginSetup = () => (
    <div className="text-center p-12">
      <h2 className="text-4xl mb-4">Welcome to Aptopus</h2>
      <p className="text-gray-300 text-sm">Get started in just two quick steps</p>

      <div className="grid grid-cols-2 gap-5 mx-48 mt-8">
        <div className="w-full h-full">
          <p>Step 1</p>
          <Card className="bg-transparent text-gray-400 border-gray-600 border-2 rounded-sm mt-2 p-6">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <img src="/icons/wallet.svg" className="h-16 w-16 p-2 rounded-sm mx-auto" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-3 text-lg font-medium">Create Your Membership Token</p>
              <p className="text-gray-400 text-sm">
                Create a membership token to reward contributors granting them access to exclusive content and perks
                across all your platforms.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full h-full">
          <p>Step 2</p>
          <Card className="bg-transparent text-gray-400 border-gray-600 border-2 rounded-sm mt-2 p-6">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <img src="/icons/member.svg" className="h-16 w-16 p-2 rounded-sm mx-auto" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-3 text-lg font-medium">Start Your Live Stream Session</p>
              <p className="text-gray-400 text-sm">
                Begin a live stream and paste your live stream URL and Aptos wallet address, then generate a link to
                share in your chat.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const generateSuperchatUrl = async () => {
    setLiveUrl(videoUrl);
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
      toast({
        variant: "default",
        title: "Enter your Live URL and Address",
        description: "Please enter your live url and aptos address to proceed",
      });
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
    { title: "", content: <BeginSetup /> },
    { title: "Create a membership token", content: <DynamicMint /> },
    // { title: "Create an NFT badge for contributors", content: <NFT /> },
    { title: "", content: renderInputForm() },
  ];

  return (
    <div className="text-center bg-gray-90 rounded-lg p-4 h-[80vh]">
      <div className="">
        <h2 className="text-xl mb-4 text-white">{steps[currentStep].title}</h2>
        {steps[currentStep].content}
        <div className="flex justify-center mt-2">
          {currentStep < steps.length - 1 && (
            <Button
              size={"lg"}
              className="bg-red-500 text-white py-2 px-20 hover:bg-red-400 rounded-full "
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Proceed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Creator;
