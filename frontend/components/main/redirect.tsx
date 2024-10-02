import React, { useEffect } from "react";

const RedirectToPayment: React.FC = () => {
  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const shortCode = pathParts[pathParts.length - 1];

    if (shortCode) {
      fetch(`api/s/${shortCode}`)
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then((data) => {
          if (data.url) {
            const popup = window.open(data.url, "Superchat", "width=400,height=600");
            if (popup) {
              window.close();
            } else {
              window.location.href = data.url; 
            }
          } else {
            throw new Error("Invalid data returned");
          }
        })
        .catch((error) => {
          console.error("Error during redirect:", error);
        });
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to Aptopus...</p>
    </div>
  );
};

export default RedirectToPayment;
