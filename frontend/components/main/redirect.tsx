import React, { useEffect } from 'react';

const RedirectToPayment: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('vid');
    const address = urlParams.get('lnaddr');
    const popupUrl = `${window.location.origin}/superchat.html?vid=${videoId}&lnaddr=${address}`;
    const popup = window.open(popupUrl, 'Superchat', 'width=400,height=600');

    if (popup) {
      window.close();
    } else {
      // Fallback for when popups are blocked
      window.location.href = popupUrl;
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to Aptopus...</p>
    </div>
  );
};

export default RedirectToPayment;
