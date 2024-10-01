import React, { useState } from "react";
import templatesJson from "../../utils/Templates.json";
import Swap from "../templates/swap-token";
import Donate from "../templates/donate";
import NFT from "../templates/nft";
import Marketplace from "../templates/marketplace";
import Payment from "../templates/payment";
import Polls from "../templates/poll";

interface Template {
  html: string;
  js: string;
  name: string;
}

interface Templates {
  [key: string]: Template;
}

const templates: Templates = templatesJson as Templates;

interface CreateDappProps {
  currentBlinkObject: any;
  setCurrentBlinkObject: React.Dispatch<React.SetStateAction<any>>;
  handleNextClick: () => void;
}

export const CreateDapp: React.FC<CreateDappProps> = ({
  currentBlinkObject,
  setCurrentBlinkObject,
  handleNextClick,
}) => {
  const [currentBlinkObjectState, setCurrentBlinkObjectState] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  function updateBlinkObjectTemplate(id: number, name: string) {
    const newBlinkObject = { ...currentBlinkObject, templateId: id, templateName: name };
    setCurrentBlinkObject(newBlinkObject);
    setCurrentBlinkObjectState(true);
    setSelectedTemplate(name);
  }

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="grid grid-cols-3 gap-6 mt-10 ">
        {/* Render your templates here */}
        {/* {Object.keys(templates).map((template, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-center p-5 m-2 rounded-3xl border transition-all cursor-pointer 
            ${selectedTemplate === template ? "bg-gray-100 border-sky-500" : "bg-white border-transparent"}`}
          onClick={() => updateBlinkObjectTemplate(index + 1, template)}
        >
          <span className="mb-5 text-xl font-bold">{templates[template].name}</span>
          <div dangerouslySetInnerHTML={{ __html: templates[template].html }} />
        </div>
      ))} */}

        <Payment />
        <Marketplace />
        <Donate />
        <Swap />
        <NFT />
        <Polls />
      </div>

      <div className="flex justify-center w-full mt-8">
        <button
          className={`text-white text-lg py-2 rounded-lg cursor-pointer 
          ${currentBlinkObjectState ? "bg-blue-500" : "bg-black"} w-64 h-12`}
          onClick={handleNextClick}
          disabled={!currentBlinkObjectState}
        >
          {currentBlinkObjectState ? "Next" : "Select a template"}
        </button>
      </div>
    </div>
  );
};
