const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/creator", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "creator.html"));
});

app.get("/superchat", (req, res) => {
  res.send(`
        <script>
            window.resizeTo(400, 600);
            window.location.href = '/chatpopup.html?vid=${req.query.vid}';
        </script>
    `);
});

// Area to check if transaction was successful
app.post("/send-message", async (req, res) => {
  const { message, amount, videoId, address } = req.body;
  console.log("Received message:", message);
  console.log("Amount:", amount);
  console.log("Video ID:", videoId);
  console.log("Aptos Address:", address);

  try {
    // Get live chat ID
    console.log("Getting live chat ID for video:", videoId);
    const liveChatId = await getLiveChatId(videoId);
    console.log("Live chat ID obtained:", liveChatId);

    // Prepare and post message to YouTube chat
    const fullMessage = `⚡⚡ 𝗦𝗨𝗣𝗘𝗥𝗖𝗛𝗔𝗧 [${amount} APTO]: ${message.toUpperCase()}`;
    console.log("Prepared message:", fullMessage);
    console.log("Posting message to YouTube chat...");
    await postToYouTubeChat(fullMessage, liveChatId);
    console.log("Message posted successfully");

    addValidMessage(fullMessage);

    // Check the invoice status
    const invoiceStatus = await checkInvoiceStatus(invoice);
    console.log("Invoice status:", invoiceStatus);

    if (invoiceStatus.paid) {
      res.json({
        invoice,
        status: "Invoice paid and message posted to YouTube chat",
      });
    } else {
      res.status(500).json({
        status: "Error processing request",
        error: "Invoice not paid",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: "Error processing request", error: error.message });
  }
});

app.post("/simulate-payment", async (req, res) => {
  const { message, amount, videoId } = req.body;
  try {
    console.log("Message:", message);
    console.log("Amount:", amount);
    console.log("Video ID:", videoId);

    // Send message to YouTube chat
    try {
      await axios.post(
        `${process.env.VERCEL_URL || "http://localhost:3001"}/post-message`,
        {
          message: `⚡⚡ 𝗦𝗨𝗣𝗘𝗥𝗖𝗛𝗔𝗧 [${amount} APTO] ⚡⚡: ${message.toUpperCase()}`,
          videoId: videoId,
        }
      );
      res.json({
        success: true,
        message: "Payment simulated and message posted to YouTube chat",
      });
    } catch (botError) {
      console.error("Error posting message to YouTube:", botError);
      res.status(500).json({
        success: false,
        message: "Error posting message to YouTube chat",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing payment",
      error: error.message,
    });
  }
});

if (require.main === module) {
  app
    .listen(port, () => {
      console.log(`Server running webapp on port ${port}`);
    })
    .on("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    });
}

module.exports = {
  app,
};
