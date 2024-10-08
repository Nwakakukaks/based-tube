import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { transferAPT } from "@/entry-functions/transferAPT";
import { aptosClient } from "@/utils/aptosClient";
import { toast } from "../ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";

const Payment: React.FC = () => {
  const { connected, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [videoId, setVideoId] = useState(new URLSearchParams(window.location.search).get("vid") || "");

  const sendSuperchat = async () => {
    if (message && amount) {
      setLoading(true);

      try {
        const response = await fetch("/api/send-message", {
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
          await submitPayment();
        }
      } catch (error) {
        alert("Error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const submitPayment = async () => {
    setLoading(true);

    const address = new URLSearchParams(window.location.search).get("lnaddr");
    const transferAmount = Math.floor(parseFloat(amount) * Math.pow(10, 8)); // Use parseFloat

    if (isNaN(transferAmount) || transferAmount <= 0) {
      alert("Please enter a valid amount.");
      setLoading(false);
      return;
    }

    console.log("Amount entered:", amount);
    console.log("Transfer amount (in smallest unit):", transferAmount);

    try {
      const committedTransaction = await signAndSubmitTransaction(
        transferAPT({
          to: address!,
          amount: transferAmount,
        }),
      );

      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      if (executedTransaction && executedTransaction.hash) {
        queryClient.invalidateQueries();

        toast({
          title: "Success",
          description: `Transaction succeeded, hash: ${executedTransaction.hash}`,
        });

        const hash = executedTransaction.hash;
        // Simulate the payment
        const response = await fetch("/api/simulate-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            amount,
            videoId,
            address,
            hash,
          }),
        });

        const data = await response.json();
        if (data.success) {
          showSuccessMessage();
        }
      } else {
        toast({
          title: "Error",
          description: "Transaction failed. Please try again.",
        });
      }
    } catch (error) {
      alert("Error simulating payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = () => {
    setSuccessMessage(`Your Superchat has been posted to YouTube.\nMessage: ${message}\nAmount: ${amount} APTO`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className={`bg-white rounded-lg shadow-md p-6`}>
        <h1 className="text-2xl text-blue-600">Aptopus 🐙</h1>
        <Input
          name="message"
          placeholder="Enter your Superchat message"
          type="text"
          maxLength={220}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded p-2 mt-2 mb-4 text-gray-800"
        />
        <Input
          name="amount"
          placeholder="Amount in sats"
          type="number" // Change input type to number
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded p-2 mt-2 mb-4 text-gray-800"
        />
        <Button
          id="send-superchat-button"
          onClick={sendSuperchat} // Change to call sendSuperchat
          disabled={loading}
          className={`w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded p-2 transition-all duration-300 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Sending..." : "Send Superchat"}
        </Button>
        {loading && <div className="loader"></div>}
      </div>

      {successMessage && (
        <div className="bg-green-600 rounded-lg p-4 mt-4">
          <h2 className="text-xl font-bold">Payment Successful!</h2>
          <p>{successMessage}</p>
          <p>Congrats you can claim your membership token and NFT here: <a>http://localhost:5173/claim</a></p>
        </div>
      )}
    </div>
  );
};

export default Payment;
