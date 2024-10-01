import React, { useState, useEffect } from "react";
import EditElement from "../general/EditElement";
import templatesJson from "../../utils/Templates.json";
// import { saveAs } from 'file-saver';
import { Loader } from "lucide-react";

interface Template {
  html: string;
  js: string;
  name: string;
}

interface Templates {
  [key: string]: Template;
}

const templates: Templates = templatesJson as Templates;

interface EditDappProps {
  currentBlinkObject: any;
  setCurrentBlinkObject: (blinkObject: any) => void;
  handleNextClick: () => void;
  setNewIPFShash: (hash: string) => void;
  newIPFShash: string;
}

const EditDapp: React.FC<EditDappProps> = ({
  currentBlinkObject,
  // setCurrentBlinkObject,
  handleNextClick,
  setNewIPFShash,
  // newIPFShash,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editingElement, setEditingElement] = useState<HTMLElement | null>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("#333333");
  const [text, setText] = useState<string>("Your text here");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [referrer, setReferrer] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [destinationDecimals, setDestinationDecimals] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("0x000000000000000000000000000000000");

  useEffect(() => {
    if (currentBlinkObject.templateName) {
      setSelectedTemplate(currentBlinkObject.templateName);
    }
  }, [currentBlinkObject]);

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    setEditingElement(null);
  };

  const handleElementClick = (element: HTMLElement) => {
    setEditingElement(element);
    setBgColor(element.style.backgroundColor || "#ffffff");
    setTextColor(element.style.color || "#333333");
    setText(element.textContent || "Your text here");

    if (element instanceof HTMLImageElement) {
      setShowTooltip(true);
      setImageUrl(element.src);
    } else {
      setShowTooltip(false);
    }
  };

  const handleBgColorChange = (newColor: string) => {
    setBgColor(newColor);
    if (editingElement) {
      editingElement.style.backgroundColor = newColor;
    }
  };

  const handleTextColorChange = (newColor: string) => {
    setTextColor(newColor);
    if (editingElement) {
      editingElement.style.color = newColor;
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (editingElement) {
      editingElement.textContent = newText;
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const updateImageUrl = () => {
    if (editingElement) {
      (editingElement as HTMLImageElement).src = imageUrl;
    }
    setShowTooltip(false);
  };

  const cancelImageUpdate = () => {
    setShowTooltip(false);
  };

  const createBlink = async () => {
    const editedHtml = document.querySelector(".templateContainer")!.innerHTML;
    const htmlContent = `
      ${editedHtml}
    `;

    const modifiedJs = templates[selectedTemplate!].js
      .replace("referrer = null", `referrer = "${referrer}";`)
      .replace(
        /destinationToken = \{[\s\S]*?\}/,
        `destinationToken = { 
          name: "${tokenName}",
          address: "${destinationAddress}",
          decimals: ${destinationDecimals},
          image: "https://cdn3d.iconscout.com/3d/premium/thumb/usdc-10229270-8263869.png?f=webp"
        };`,
      )
      .replace(/const recipient = '0x53FA684bDd93da5324BDc8B607F8E35eC79ccF5A';/, `const recipient = '${recipient}';`);

    const iFrame = { iframe: { html: htmlContent, js: modifiedJs } };
    const res = await fetch("http://localhost:8000/storeToIpfs", {
      method: "POST",
      body: JSON.stringify(iFrame),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let ipfsText = await res.text();
    setNewIPFShash(ipfsText);
    handleNextClick();
  };

  const handleDeployClick = async () => {
    setIsLoading(true);
    await createBlink();
    await new Promise((resolve) => setTimeout(resolve, 4000));
    setIsLoading(false);
  };

  const handleDownloadClick = () => {
    const editedHtml = document.querySelector(".templateContainer")!.innerHTML;
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Component</title>
</head>
<body>
  <div class="templateContainer">
    ${editedHtml}
  </div>
</body>
</html>
    `;

    const modifiedJs = templates[selectedTemplate!].js
      .replace("var referrer;", `var referrer = '${referrer}';`)
      .replace(
        /destinationToken = \{(.|\n)*?\};/,
        `destinationToken = { 
          name: "${tokenName}",
          address: "${destinationAddress}",
          decimals: ${destinationDecimals},
          image: "https://cdn3d.iconscout.com/3d/premium/thumb/usdc-10229270-8263869.png?f=webp"
        };`,
      );

    const iFrame = { iframe: { html: htmlContent, js: modifiedJs } };
    const blob = new Blob([JSON.stringify(iFrame, null, 2)], { type: "application/json" });
    // saveAs(blob, 'blinkTemplate.json');
  };

  return (
    <div className="p-4 zoom-75">
      <h4 className="text-xl font-bold">Edit Your Blink</h4>
      <p className="text-lg">Click on the element you want to edit and change its color, text, or image</p>
      {isLoading ? (
        <div className="flex justify-center items-center mt-20 flex-col">
          {/* <Loader /> */}
          <img src="/public/icons/loader.svg" className="animate-spin h-12 w-12" alt="Loading" />
          <p>Deploying Your APT-Link To IPFS</p>
        </div>
      ) : (
        <>
          {selectedTemplate && (
            <div className="flex bg-white rounded-lg shadow-md p-4 mt-12">
              <div
                className="templateContainer flex-1 rounded-lg p-4 mr-4"
                dangerouslySetInnerHTML={{ __html: templates[selectedTemplate].html }}
                onClick={(e) => handleElementClick(e.target as HTMLElement)}
              />
              {editMode && (
                <EditElement
                  bgColor={bgColor}
                  textColor={textColor}
                  text={text}
                  onBgColorChange={handleBgColorChange}
                  onTextColorChange={handleTextColorChange}
                  onTextChange={handleTextChange}
                  createBlink={createBlink}
                />
              )}
              {showTooltip && (
                <div className="absolute bg-white p-2 rounded shadow-md">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="Enter image URL"
                    className="p-2 border border-gray-300 rounded mb-2"
                  />
                  <div className="flex justify-between">
                    <button onClick={updateImageUrl} className="bg-green-500 text-white p-1 rounded">
                      Post
                    </button>
                    <button onClick={cancelImageUpdate} className="bg-red-500 text-white p-1 rounded">
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-4 flex gap-4">
            {!editMode ? (
              <>
                <button
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
                <button
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
                  onClick={handleDeployClick}
                >
                  Deploy
                </button>
                <button
                  className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600"
                  onClick={handleDownloadClick}
                >
                  Download Template
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => setEditMode(false)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-black font-semibold py-2 px-4 rounded hover:bg-gray-400"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          {selectedTemplate === "swap" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2">Edit Swap Fields</h5>
              <label className="block mb-1">Referrer</label>
              <input
                type="text"
                value={referrer}
                onChange={(e) => setReferrer(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
              <label className="block mb-1">Token Name</label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
              <label className="block mb-1">Token Address</label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
              <label className="block mb-1">Token Decimals</label>
              <input
                type="number"
                value={destinationDecimals}
                onChange={(e) => setDestinationDecimals(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
          )}
          {selectedTemplate === "donation" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit Donation Fields</h5>
              <label className="block mb-1">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditDapp;
