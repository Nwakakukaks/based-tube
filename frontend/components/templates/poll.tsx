import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const Polls = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(720);

  const handleResponse = async () => {
    setLoading(true);
    setSuccess(false);

    // Simulating the process
    await new Promise((resolve) => setTimeout(resolve, 5000));

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 10000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    const hours = String(Math.floor(time / 60)).padStart(2, "0");
    const minutes = String(time % 60).padStart(2, "0");
    return `${hours} : ${minutes} : 00`;
  };

  return (
    <div>
      <p className="text-lg font-medium text-gray-400 ">Poll Template</p>
      <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px]">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3cXPyS4JnrjPmytFlpWZ2Y3gkRdK087boqXfG"
          alt="Swap aptos"
          className="w-full h-auto max-h-48 object-contain mb-4"
        />

        <div className="py-2 px-1 flex flex-col">
          <div>
            <Label className="text-gray-700">Poll options:</Label>
            <div className="space-y-2 mt-2">
              {["Option 1", "Option 2", "Option 3"].map((option, index) => (
                <Button
                  key={index}
                  onClick={handleResponse}
                  disabled={loading}
                  className="bg-teal-400 text-white font-bold py-3 rounded-sm w-full"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-gray-700 space-x-1">
            <Label>Poll length:</Label>
            <span>{formatTime(timer)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Polls;
