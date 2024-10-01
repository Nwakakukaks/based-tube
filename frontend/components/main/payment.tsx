import React, { useState, useEffect } from 'react';

const Payment: React.FC = () => {
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [videoId, setVideoId] = useState(new URLSearchParams(window.location.search).get("vid") || '');
  
  useEffect(() => {
    if (invoice) {
      checkPaymentStatus(invoice);
    }
  }, [invoice]);

  const sendSuperchat = async () => {
    if (message && amount) {
      setLoading(true);
      setPaymentStatus("Waiting for payment...");
      
      try {
        const response = await fetch("/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            amount: parseInt(amount),
            videoId,
            address: new URLSearchParams(window.location.search).get("lnaddr"),
          }),
        });
        const data = await response.json();

        if (data.error) {
          alert(data.error);
        } else {
          setShowInvoice(true);
          setInvoice(data.invoice);
        }
      } catch (error) {
        alert("Error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const checkPaymentStatus = (invoice: string) => {
    let checkCount = 0;
    const maxChecks = 30;

    const checkStatus = async () => {
      if (checkCount >= maxChecks) {
        setPaymentStatus("Payment timeout. Please try again.");
        return;
      }
      try {
        const response = await fetch(`/check-invoice/${invoice}`);
        const data = await response.json();
        if (data.paid) {
          showSuccessMessage();
        } else {
          checkCount++;
          setTimeout(checkStatus, 10000);
        }
      } catch (error) {
        setPaymentStatus("Error checking payment status. Please refresh and try again.");
      }
    };

    checkStatus();
  };

  const simulatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, amount, videoId }),
      });
      const data = await response.json();
      if (data.success) {
        showSuccessMessage();
      }
    } catch (error) {
      alert("Error simulating payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = () => {
    setShowInvoice(false);
    setSuccessMessage(`Your Superchat has been posted to YouTube.\nMessage: ${message}\nAmount: ${amount} sats`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className={`bg-white rounded-lg shadow-md p-6 ${showInvoice ? 'hidden' : ''}`}>
        <h1 className="text-2xl text-red-600">Aptopus 🐙</h1>
        <textarea
          id="message"
          placeholder="Enter your Superchat message"
          rows={4}
          maxLength={220}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded p-2 mt-2 mb-4"
        />
        <input
          type="number"
          id="amount"
          placeholder="Amount in sats"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded p-2 mt-2 mb-4"
        />
        <button
          id="send-superchat-button"
          onClick={sendSuperchat}
          disabled={loading}
          className={`w-full bg-gradient-to-br from-red-600 to-red-800 text-white rounded p-2 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Sending...' : 'Send Superchat'}
        </button>
        {loading && <div className="loader"></div>}
      </div>

      {showInvoice && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-xl">Invoice Details</h1>
          <p>Please pay the following invoice:</p>
          <pre id="invoice" className="bg-gray-100 p-2 rounded border">{invoice}</pre>
          <div id="qrcode" className="flex justify-center my-4">
            {/* QR Code will be generated here */}
          </div>
          <div id="payment-status" className="font-bold text-primary mt-2">{paymentStatus}</div>
          <button
            id="simulate-payment-button"
            onClick={simulatePayment}
            className="bg-yellow-500 text-white p-2 rounded mt-4"
          >
            Pay Now
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 rounded-lg p-4 mt-4">
          <h2 className="text-xl font-bold">Payment Successful!</h2>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
