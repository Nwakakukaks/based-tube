import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { HeroSection } from "./components/main/hero-section";
import { Features } from "./components/main/features";

function App() {
  const { connected } = useWallet();

  return (
    <>
      <HeroSection />
      <Features />
    </>
  );
}

export default App;