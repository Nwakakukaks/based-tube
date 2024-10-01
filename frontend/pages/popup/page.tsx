import { Assistant } from "@/components/main/assistant";
import RedirectToPayment from "@/components/main/redirect";

export const TemplatePages = () => {
  return (
    <div>
      <RedirectToPayment />
      <Assistant />
    </div>
  );
};
