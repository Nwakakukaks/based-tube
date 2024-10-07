import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col gap-3 items-center mt-12">
      <p className="md:text-6xl text-3xl text-center font-semibold">
        Receive youtube superchats in <span className="text-red-500">Aptos</span> Tokens
      </p>
      <p className="text-gray-400 font-medium max-w-2xl mx-auto text-center">
        Create shareable links to recieve SUPERCHATS in Aptos tokens from your viewers during live streams. Coming soon on X, Tiktok and Instagram!
      </p>

      <Button onClick={handleGetStarted} size={"lg"} className="bg-red-500 rounded-full hover:bg-red-300 text-black">
        Get Started
      </Button>

      {/* Todo; add image  */}
      <img src="/icons/bg.png" className="rounded-md mt-6 mb-1" />
    </div>
  );
};
