import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

interface EditElementProps {
  bgColor: string;
  textColor: string;
  text: string;
  onBgColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onTextChange: (text: string) => void;
  createBlink?: () => void;
}

const EditElement: React.FC<EditElementProps> = ({
  bgColor: initialBgColor,
  textColor: initialTextColor,
  text: initialText,
  onBgColorChange,
  onTextColorChange,
  onTextChange,
  
}) => {
  const [bgColor, setBgColor] = useState<string>(initialBgColor);
  const [textColor, setTextColor] = useState<string>(initialTextColor);
  const [text, setText] = useState<string>(initialText);
  const [hexInput, setHexInput] = useState<string>(initialBgColor);
  const [colorTarget, setColorTarget] = useState<'background' | 'text'>('background');

  useEffect(() => {
    setBgColor(initialBgColor);
    setTextColor(initialTextColor);
    setText(initialText);
  }, [initialBgColor, initialTextColor, initialText]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexInput(newColor);
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      if (colorTarget === 'background') {
        setBgColor(newColor);
        onBgColorChange(newColor);
      } else {
        setTextColor(newColor);
        onTextColorChange(newColor);
      }
    }
  };

  const handleColorChange = (newColor: string) => {
    setHexInput(newColor);
    if (colorTarget === 'background') {
      setBgColor(newColor);
      onBgColorChange(newColor);
    } else {
      setTextColor(newColor);
      onTextColorChange(newColor);
    }
  };

  const toggleColorTarget = () => {
    setColorTarget((prevTarget) => (prevTarget === 'background' ? 'text' : 'background'));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTextChange(e.target.value);
  };

  return (
    <div className="flex flex-row bg-white p-5 w-2/5 max-h-[80vh] rounded-2xl shadow-lg">
      <div className="flex flex-col justify-between w-full">
        <div className="flex flex-col items-center mb-5">
          <label className="font-sans text-base mb-2">
            Change {colorTarget === 'background' ? 'Background' : 'Text'} Color
          </label>
          <HexColorPicker
            color={colorTarget === 'background' ? bgColor : textColor}
            onChange={handleColorChange}
            className="mb-5 w-full"
          />
          <input
            type="text"
            value={hexInput}
            onChange={handleHexInputChange}
            className="w-full p-2 border rounded mb-5 text-center"
            placeholder="#000000"
          />
          <button
            onClick={toggleColorTarget}
            className="w-full p-2 border rounded bg-white cursor-pointer hover:bg-gray-200"
          >
            {colorTarget === 'background' ? 'Switch to Text Color' : 'Switch to Background Color'}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <label className="font-sans text-base mb-2">Edit Text:</label>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            className="w-full p-2 border rounded mb-5"
          />
        </div>
      </div>
    </div>
  );
};

export default EditElement;
