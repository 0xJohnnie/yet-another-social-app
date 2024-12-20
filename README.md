# YASA - Yet Another Social App

A social dApp that supports Account Abstraction

## Note
The app is currently not functional, I have a walkthrough video and screenshots available for reference.

### Walkthrough video
https://github.com/user-attachments/assets/4913422a-6a10-44a2-b221-831579d15811

### Gas sponsorship via Gelato Network
![Gas sponsorship via Gelato Network](https://github.com/user-attachments/assets/71d633da-869e-4c31-b223-49d24b2e4136)

### Wallet-to-wallet communication via Push Protocol
( Wallet A and Wallet B shown side-by-side to showcase the messaging process
![Wallet-to-wallet communication via Push Protocol](https://github.com/user-attachments/assets/4b844f05-7c8d-4842-a970-6e72e5196020)

## Purpose

YASA offers a unified platform that enables social interation between wallets on different blockchains

## Key features planned for the Ethglobal ETHOnline 2023 Hackathon

1. Account Abstraction Smart contract wallet by Safe (Previously known as Gnosis Safe)

2. Login using social account (Google / Twitter / Discord)

3. Login using an EOA via desktop EVM wallet extension (Metamask / Rabby)

4. Login using Email address

5. Sponsor gas using a Relayer (Gelato)

6. Messsaging between EOA and Safe AA wallets (Push Protocol)

### Features Wish list

1. Token gated messsaging between wallets

2. Community and user profile pages

3. Swap (buy/sell) tokens via Uniswap

4. On-ramp fiat into crypto within the dApp

5. Seamlessly transfer tokens across various chains without bridging

6. **NFT Collection Creation and Minting**
   Enable users to create and mint their own non-fungible token (NFT) collections, simplifying the creation and sharing of unique digital assets.

## Technologies

### Web3-Related

1. Safe{Core} Account Abstraction SDK
   ↪️https://github.com/safe-global/safe-core-sdk

2. Gelato (Relayer for gasless transactions)
   ↪️https://github.com/gelatodigital

3. Web3Auth (Non-custodial auth infrastructure for Web3 wallets and dApp)
   ↪️https://github.com/Web3Auth

4. Push Protocol (Cross-chain communication protocol)
   ↪️https://github.com/ethereum-push-notification-service/push-sdk

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

# Feedback

To reach out with feedback, you can:

1. DM me on Twitter : `https://twitter.com/0xJohnnie`
2. Email me : `github@0xJohnnie.dev`
3. Create an issue on GitHub to describe the problem or feature you want to address.
