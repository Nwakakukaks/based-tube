// require('dotenv').config(); // Ensure this is at the very top
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const {
  AccountTokenAuthProvider,
  LightsparkClient,
  InvoiceType,
  BitcoinNetwork,
} = require("@lightsparkdev/lightspark-sdk");
const { google } = require("googleapis");
const cors = require("cors");
const { monitorLiveChat, eventEmitter } = require("./chatbot/messageMonitor");
const {
  addValidMessage,
  isValidMessage,
  isSuperchatFormat,
} = require("./chatbot/messageValidator");

dotenv.config();
const app = express();
const port = process.env.PORT || 3001; //why isnt 3000 working????

app.use(express.json()); //  parse JSON in request body



const youtube = google.youtube("v3");
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// Include route handlers from webapp/index.js
const { postToYouTubeChat, getLiveChatId } = require("./chatbot/index");

app.use(cors());

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.post("/send-message", async (req, res) => {
  const { message, amount, videoId, address } = req.body;
  console.log("Received message:", message);
  console.log("Amount:", amount);
  console.log("Video ID:", videoId);
  console.log("Aptos Address:", address);

  try {
    // Check that video is actually live rn
    const liveChatId = await getLiveChatId(videoId);
    console.log("Live chat ID obtained:", liveChatId);

    const fullMessage = `⚡⚡ 𝗦𝗨𝗣𝗘𝗥𝗖𝗛𝗔𝗧 [${amount} APTO]: ${message.toUpperCase()}`;
    addValidMessage(fullMessage);

    res.json({ status: "created" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: "Error processing request", error: error.message });
  }
});

// Area to implement check transaction status
app.get("/check-invoice/:invoice", async (req, res) => {
  try {
    const invoice = req.params.invoice;
    const paymentHash = invoice.paymentHash;

    const status =
      paymentHash.length > 0 && paymentHash[0].status === "SUCCESS"
        ? { paid: true }
        : { paid: false };

    res.json(status);
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Error checking payment status" });
  }
});

const validSuperchatsFile = path.join(
  __dirname,
  "chatbot",
  "validSuperchats.json"
);

// Load valid superchats from file
let validSuperchats = {};
if (fs.existsSync(validSuperchatsFile)) {
  validSuperchats = JSON.parse(fs.readFileSync(validSuperchatsFile, "utf8"));
}

// Area to implement APTOS transfer to address
app.post("/simulate-payment", async (req, res) => {
  const { message, amount, videoId } = req.body;
  console.log("Payment simulation request received:", {
    message,
    amount,
    videoId,
  });

  try {
    await lightsparkClient.loadNodeSigningKey(nodeId, {
      password: process.env.TEST_NODE_PASSWORD,
    });
    console.log("Node signing key loaded.");

    // Convert amount to millisatoshis (multiply by 1000) cos lightspark api expects this
    const amountMsats = Number(amount) * 1000;

    const payment = await lightsparkClient.payInvoice(
      nodeId,
      invoice,
      amountMsats,
      60
    );
    if (!payment) {
      throw new Error("Unable to pay invoice.");
    }
    console.log("Payment done with ID:", payment.id);

    const liveChatId = await getLiveChatId(videoId);
    const fullMessage = `⚡⚡ 𝗦𝗨𝗣𝗘𝗥𝗖𝗛𝗔𝗧 [${amount} APTO]: ${message.toUpperCase()}`;
    await postToYouTubeChat(fullMessage, liveChatId);
    addValidMessage(fullMessage);

    // Add the message ID to validSuperchats
    if (!validSuperchats[videoId]) {
      validSuperchats[videoId] = [];
    }
    validSuperchats[videoId].push(payment.id);
    fs.writeFileSync(
      validSuperchatsFile,
      JSON.stringify(validSuperchats, null, 2)
    );

    // Update the payment status immediately
    res.json({
      success: true,
      message: "Payment confirmed and message posted to YouTube chat",
    });
  } catch (error) {
    console.error("Error in simulate-payment:", error);
    res.status(500).json({
      success: false,
      message: "Error processing payment",
      error: error.toString(),
    });
  }
});

app.post("/post-message", async (req, res) => {
  const { message, videoId } = req.body;
  console.log("Bot received message:", message, "for video ID:", videoId);
  console.log("YouTube API credentials:", {
    clientId: process.env.YOUTUBE_CLIENT_ID ? "Set" : "Not set",
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET ? "Set" : "Not set",
    redirectUri: process.env.YOUTUBE_REDIRECT_URI,
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN ? "Set" : "Not set",
  });
  try {
    console.log("Attempting to get live chat ID...");
    const liveChatId = await getLiveChatId(videoId);
    console.log("Live chat ID obtained:", liveChatId);

    console.log("Attempting to post to YouTube chat...");
    await postToYouTubeChat(message, liveChatId);
    console.log("Message posted successfully");

    res.json({ status: "Message posted to YouTube live chat" });
  } catch (error) {
    console.error("Error posting to YouTube:", error);
    console.error(
      "Error details:",
      error.response ? error.response.data : "No response data"
    );
    res.status(500).json({
      status: "Error posting message",
      error: error.message,
      details: error.response ? error.response.data : "No response data",
    });
  }
});

app.get("/test-youtube-api/:videoId", async (req, res) => {
  console.log("Testing YouTube API for video ID:", req.params.videoId);
  console.log("YouTube API credentials:", {
    clientId: process.env.YOUTUBE_CLIENT_ID ? "Set" : "Not set",
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET ? "Set" : "Not set",
    redirectUri: process.env.YOUTUBE_REDIRECT_URI,
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN ? "Set" : "Not set",
  });
  try {
    const liveChatId = await getLiveChatId(req.params.videoId);
    res.json({ success: true, liveChatId });
  } catch (error) {
    console.error("Error testing YouTube API:", error);
    res
      .status(500)
      .json({ success: false, error: error.message, stack: error.stack });
  }
});

const shortUrls = new Map();

function generateShortCode() {
  return Math.random().toString(36).substr(2, 6);
}

app.post("/generate-short-url", async (req, res) => {
  const { videoId, address } = req.body;
  console.log("Received request:", { videoId, address });

  try {
    // Check that video is actually live
    const liveChatId = await getLiveChatId(videoId);
    console.log("Live chat ID obtained:", liveChatId);

    const shortCode = generateShortCode();

    shortUrls.set(shortCode, { videoId, address });
    console.log("Generated short code:", shortCode);

    // Start monitoring the live chat
    monitorLiveChat(videoId).catch((error) => {
      console.error("Failed to start monitoring:", error);
      // Don't throw an error here, just log it
    });

    res.json({ shortCode });
  } catch (error) {
    console.error("Error generating short URL:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/s/:shortCode", (req, res) => {
  const { shortCode } = req.params;
  const urlData = shortUrls.get(shortCode);
  if (urlData) {
    res.redirect(`/superchat?vid=${urlData.videoId}&lnaddr=${urlData.address}`);
  } else {
    res.status(404).send("Short URL not found");
  }
});

// endpoint to stream superchat events
app.get("/superchat-events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onNewSuperchat = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  eventEmitter.on("newSuperchat", onNewSuperchat);

  req.on("close", () => {
    eventEmitter.removeListener("newSuperchat", onNewSuperchat);
  });
});

// endpoint to start monitoring live chat
app.post("/start-monitoring", (req, res) => {
  const { videoId } = req.body;
  console.log("Received request to start monitoring:", videoId);
  if (videoId) {
    monitorLiveChat(videoId)
      .then(() => {
        console.log("Monitoring started successfully for:", videoId);
        res.json({ success: true });
      })
      .catch((error) => {
        console.error("Error starting monitoring:", error);
        res.json({ error: error.message });
      });
  } else {
    console.error("Invalid video ID received");
    res.json({ error: "Invalid video ID" });
  }
});


// Area to implement transaction messages
app.post("/fetch-messages", async (req, res) => {
  try {
    const { address } = req.body;
    const account = await lightsparkClient.getCurrentAccount();
    if (!account) {
      throw new Error("Unable to fetch the account.");
    }

    const transactionsConnection = await account.getTransactions(
      lightsparkClient,
      100, // Number of transactions to fetch
      undefined,
      undefined,
      undefined,
      undefined,
      BitcoinNetwork.REGTEST
    );

    const sentMessages = transactionsConnection.entities.filter(
      (transaction) => transaction.typename === "OutgoingPayment"
    );

    // See what the lightspark api returns with this, could be useful
    // console.log("Transaction Data:", JSON.stringify(sentMessages, null, 2));

    const transactions = sentMessages.map((message) => ({
      id: message.id,
      amountUSD: message.amount.preferredCurrencyValueApprox, // USD
      amountSatoshis: message.amount.originalValue / 1000, // Convert millisatoshis to satoshis
      currency: message.amount.preferredCurrencyUnit,
      timestamp: message.createdAt,
      messageText: message.paymentRequestData?.memo || "No message", // paymentRequestData is where the message is
    }));

    res.json({ transactions });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: error.message });
  }
});

app
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Try a different port.`);
    } else {
      console.error("An error occurred:", err);
    }
    process.exit(1);
  });

module.exports = app;
