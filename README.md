# YASA - Yet Another Social App

A cross-chain event management and social dApp that supports Account Abstraction

## Purpose

YASA simplifies event management by offering a unified platform that enables social interation between wallets on different blockchains and event ticketing

## Key features planned for the Ethglobal ETHOnline 2023 Hackathon

1. Login using social accounts to a smart contract wallet (Account Abstraction)
2. Token gated messsaging between cross-chain wallets
3. Seamlessly transfer tokens across various chains without bridging

4. Login into an EOA via wallet extensions
5. Swap (buy/sell) tokens via Uniswap
6. On-ramp fiat into crypto within the dApp

### Features Wish list

1. **Dynamic QR Code Generation for Event Check-in**
   Allow event organizers to seamlessly check in attendees using dynamic QR codes generated within the app.

2. **POAP Airdrop to Attendees**
   Automatically distribute Proof of Attendance Protocol (POAP) tokens to event attendees, streamlining rewards and recognition for participation.

3. Event creation and ticket management using smart contracts

4. **NFT Collection Creation and Minting**
   Enable users to create and mint their own non-fungible token (NFT) collections, simplifying the creation and sharing of unique digital assets.

5. Community and user profile pages

## Technologies

### Web3-Related

1. Safe{Core} Account Abstraction SDK
   ↪️https://github.com/safe-global/safe-core-sdk

2. Alchemy (API to query the blockchain)
   ↪️https://www.alchemy.com/sdk

3. Wagmi (React hooks for Ethereum)
   ↪️https://github.com/wagmi-dev/wagmi

4. Viem (Typescript interface for Ethereum)
   ↪️https://github.com/wagmi-dev/viem

### Essentials

1. Nextjs (React framework)
   ↪️https://github.com/vercel/next.js

2. Mantine (React components)
   ↪️https://github.com/mantinedev/mantine

3. NextPWA (Enables PWA deployment)
   ↪️https://github.com/DuCanhGH/next-pwa

## Getting started

1. Clone the repository: `https://github.com/0xJohnnie/yet-another-social-app.git`
2. Install dependencies: `yarn install`
3. Copy the .env.example file to `.env` and edit the variables to match your local environment.
4. Run `yarn dev` to launch the application in your local development environment.

## Miscellaneous

🚧 Please note that the detault API key for Alchemy SDK may be rate-limited based on traffic.

To avoid this, replace it with your own Alchemy SDK key by editing the `REACT_APP_ALCHEMY_API_KEY` environment variable in the `.env` file.

# Feedback

To reach out with feedback, you can:

1. DM me on Twitter : `https://twitter.com/0xJohnnie`
2. Email me : `github@0xJohnnie.dev`
3. Create an issue on GitHub to describe the problem or feature you want to address.
