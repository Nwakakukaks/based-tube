import React, { useState, useEffect } from 'react';
import templatesJson from '../../utils/Templates.json';

interface Template {
  html: string;
  js: string;
  name: string;
}

interface Templates {
  [key: string]: Template;
}

const templates: Templates = templatesJson as Templates;

interface DeployDappProps {
  currentBlinkObject: any;
  setCurrentBlinkObject: (obj: any) => void; // Adjust type as needed
  handleNextClick: () => void; // Add more specific type if needed
  newIPFShash: string;
}

const DeployDapp: React.FC<DeployDappProps> = ({
  currentBlinkObject,
  // setCurrentBlinkObject,
  // handleNextClick,
  newIPFShash,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [socialLinkCopied, setSocialLinkCopied] = useState(false);

  useEffect(() => {
    if (currentBlinkObject.templateName) {
      setSelectedTemplate(currentBlinkObject.templateName);
    }
  }, [currentBlinkObject]);

  const copyLink = async () => {
    try {
      const url = `ipfs://${newIPFShash}`; // The IPFS link you want to copy
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const copySocialLink = async () => {
    try {
      const url = `<blk ipfs://${newIPFShash} blk>`;
      await navigator.clipboard.writeText(url);
      setSocialLinkCopied(true);
      setTimeout(() => setSocialLinkCopied(false), 2000);
    } catch (error) {
      console.error('Error copying social link:', error);
    }
  };

  return (
    <div className="p-5 zoom-75">
      <h4 className="text-lg font-bold">Your Blink Is Ready</h4>
      <p className="text-base">It has been deployed and can be accessed via IPFS using the link below</p>
      <div className="mt-3 flex gap-2">
        <button
          className="bg-skyblue text-white font-semibold text-lg p-2 rounded transition duration-300 ease-in-out hover:bg-sky-600 w-1/2"
          onClick={copyLink}
        >
          {linkCopied ? 'IPFS Link Copied To Clipboard' : 'Copy Link'}
        </button>
        <button
          className="bg-blue-600 text-white font-semibold text-lg p-2 rounded transition duration-300 ease-in-out hover:bg-blue-700 w-1/2"
          onClick={copySocialLink}
        >
          {socialLinkCopied ? 'Social Link Copied To Clipboard' : 'Post To Socials'}
        </button>
      </div>
      {selectedTemplate && (
        <div className="flex flex-row bg-white bg-opacity-80 rounded-lg shadow-lg p-4 mt-12 mb-5 backdrop-blur-md">
          <div
            className="flex-1 rounded-lg p-5 mr-5"
            dangerouslySetInnerHTML={{ __html: templates[selectedTemplate].html }}
          />
        </div>
      )}
    </div>
  );
};

export default DeployDapp;
