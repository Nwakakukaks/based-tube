# superbase 
## Base Network Superchat for YouTube

SuperBase integrates Base Network payments with YouTube live streams, allowing viewers to send ETH directly to creators during live streams and see their superchats appear in real time on the live chat.

TLDR: A Youtube superchat alternative, where a user can pay via Base network directly to the content creator via a popup from a URL in the chat.

Simple Setup: The creator generates a unique URL.
Easy Interaction: Users click the URL to open a popup for sending superchats.
Real-Time Display: The bot posts messages to the live chat, visible to everyone.

## Features

- Send ETH directly to creators via Base Network - popup payment window, so no need to leave the stream and miss any of the live content.
- Display superchats in YouTube live chat in real time
- Validates authentic SuperBase messages and removes fake ones
- Flexible Payment Amounts: Viewers can choose how much to donate
- Creator dashboard to view superchats and payments coming in in real-time or historical data from previous lives

Live demo: [SuperBase](https://superbase.vercel.app)

***For the best experience please use YouTube in Firefox as sometimes the popup doesn't open in other browsers (like Brave).***

## What it does / how it works

1. Creators generate a unique SuperBase link from the creator landing page.
2. The link is connected to their Base address and video ID, they can pin it in their livestream for visibility.
3. Viewers click this link to send ETH directly to the creator's wallet via Base Network.
4. Viewers can include a message that instantly appears as a special superchat in the YouTube live chat.
5. The system validates authentic SuperBase messages and removes fake ones.

## Impact

SuperBase addresses key challenges in the creator economy:

1. **Reduced Fees**: Enables creators to retain a larger portion of their earnings.
2. **Global Reach**: Allows international viewers to easily support creators.
3. **Blockchain Adoption**: Encourages wider use of blockchain and Base Network in everyday transactions.
4. **Scalability**: The system can be adapted for other streaming platforms and use cases.

## Contribution to Base Ecosystem

SuperBase directly contributes to the growth of the Base ecosystem by:

1. Increasing Base Network adoption and usage
2. Demonstrating practical, user-friendly applications of Base network in everyday scenarios
3. Bridging the gap between traditional content platforms and cryptocurrency

## Getting Started

To use SuperBase, creators need:

- A YouTube account with live streaming enabled
- A Base Network wallet address
- That's literally it. So easy. So fast. No tech knowledge necessary.

## Usage

### For Creators

1. Visit the creator page
2. Enter your YouTube Live URL and Base address
3. Generate a unique SuperBase link
4. Pin the generated link in your YouTube live chat

### For Viewers

1. Click the SuperBase link in the live chat
2. Enter your message and the amount of ETH to send
3. Pay the Base invoice
4. Your superchat will appear in the YouTube live chat

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in a `.env` file:
   ```
   YOUTUBE_CLIENT_ID=your_youtube_client_id
   YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
   YOUTUBE_REDIRECT_URI=your_youtube_redirect_uri
   YOUTUBE_REFRESH_TOKEN=your_youtube_refresh_token
   BASE_RPC_URL=your_base_rpc_url
   ```
4. Start the server: `npm start`

## Technologies Used

- Backend: Node.js with Express
- Frontend: HTML, CSS, and JavaScript
- Base Network Integration
- YouTube API: For live chat integration

## License

[MIT License](LICENSE)



<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/coinbase/onchainkit/main/site/docs/public/logo/v0-27.png">
    <img alt="OnchainKit logo vibes" src="https://raw.githubusercontent.com/coinbase/onchainkit/main/site/docs/public/logo/v0-27.png" width="auto">
  </picture>
</p>

# Onchain App Template

An Onchain App Template build with [OnchainKit](https://onchainkit.xyz), and ready to be deployed to Vercel.

Play with it live on https://onchain-app-template.vercel.app

Have fun! ⛵️

<br />

## Setup

To ensure all components work seamlessly, set the following environment variables in your `.env` file using `.env.local.example` as a reference.

You can find the API key on the [Coinbase Developer Portal's OnchainKit page](https://portal.cdp.coinbase.com/products/onchainkit). If you don't have an account, you will need to create one. 

You can find your Wallet Connector project ID at [Wallet Connect](https://cloud.walletconnect.com).

```sh
# See https://portal.cdp.coinbase.com/products/onchainkit
NEXT_PUBLIC_CDP_API_KEY="GET_FROM_COINBASE_DEVELOPER_PLATFORM"

# See https://cloud.walletconnect.com
NEXT_PUBLIC_WC_PROJECT_ID="GET_FROM_WALLET_CONNECT"
```
<br />

## Locally run

```sh
# Install bun in case you don't have it
curl -fsSL https://bun.sh/install | bash

# Install packages
bun i

# Run Next app
bun run dev
```
<br />

## Resources

- [OnchainKit documentation](https://onchainkit.xyz)
- We use the [OnchainKit Early Adopter](https://github.com/neodaoist/onchainkit-early-adopter) contract written by neodaoist [[X]](https://x.com/neodaoist)

<br />

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Need more help?

If you have any questions or need help, feel free to reach out to us on [Discord](https://discord.gg/8gW3h6w5) 
or open a [Github issue](https://github.com/coinbase/onchainkit/issues) or DMs us 
on X at [@onchainkit](https://x.com/onchainkit), [@zizzamia](https://x.com/zizzamia), [@fkpxls](https://x.com/fkpxls).
