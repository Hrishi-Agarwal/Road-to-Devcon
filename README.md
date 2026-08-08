# DecentraSignal

A decentralized voting and coordination platform built on Ethereum Sepolia.

## 🚀 Live Demo

**[Open DecentraSignal](https://hrishi-agarwal.github.io/Road-to-Devcon/)**

The live demo runs on the Ethereum Sepolia testnet.

## ⚡ Quick Start

### Explore the application

Open the Live Demo above.

You can explore the interface and existing proposals without connecting a wallet.

### Test blockchain voting

To create a proposal or vote:

1. Install the MetaMask browser extension.
2. Switch MetaMask to the **Sepolia** test network.
3. Make sure your wallet has some **SepoliaETH test ETH**.
4. Open the Live Demo.
5. Click **Connect Wallet**.
6. Approve the MetaMask connection.
7. Create a proposal or open an active proposal.
8. Confirm the transaction in MetaMask.
9. Vote on an option.
10. Confirm the transaction.

**No real ETH is required. SepoliaETH has no real-world value.**

## ⛓️ Smart Contract

**Network:** Ethereum Sepolia

**Contract address:**

`0x3ff2dE84542C4cDb759a62c4eF4F2324E6B635EF`

The contract handles:

- Proposal creation
- Vote submission
- One-vote-per-wallet enforcement
- Reading proposal results

## 🧪 What is implemented

The core voting flow is deployed and tested on Sepolia:

- MetaMask wallet connection
- On-chain proposal creation
- On-chain voting
- Duplicate-vote prevention
- Blockchain contract interaction

Additional coordination, analytics and visualization features in the interface are experimental demonstrations and are not all implemented as smart-contract logic.

## 🛠️ Tech Stack

- HTML
- CSS
- JavaScript
- Solidity
- ethers.js
- MetaMask
- Ethereum Sepolia

## 📁 Project Structure

```text
Road-to-Devcon/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── contracts/
    └── DecentraSignal.sol
