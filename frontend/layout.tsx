import { Header } from "./components/general/Header";
import { LFooter } from "./components/general/L-Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center flex-col">
        <div className="w-full p-5 lg:px-32">
          {children}
        </div>
      </div>
      <LFooter />
    </>
  );
};

export default Layout;
