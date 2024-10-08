import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col gap-8 items-center mt-12">
      <p className="md:text-5xl text-3xl text-center max-w-4xl font-semibold">
        Receive youtube superchats in <span className="text-red-500">Aptos</span> Tokens
      </p>
      <p className="text-gray-400 text-sm font-medium max-w-2xl mx-auto text-center">
        Create shareable links to recieve SUPERCHATS in Aptos tokens from your viewers during live streams. Coming soon
        on X, Tiktok and Instagram!
      </p>

      <div className="flex items-center space-x-3">
        <Button onClick={handleGetStarted} size={"lg"} className="bg-red-600 rounded-full hover:bg-red-300 text-white">
          Get Started Now
        </Button>

        <Button className="bg-transparent hover:bg-transparent rounded-full text-white">
          <img className="h-7 w-7 mr-1" src="/icons/video.svg" />
          Watch video
        </Button>
      </div>

      {/* Todo; chnage image  */}
      {/* <img src="/icons/bg.png" className="rounded-md mt-10 mb-1" /> */}
    </div>
  );
};
