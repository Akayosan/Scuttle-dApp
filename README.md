# Scuttle NFT Gaming dApp

A complete Web3 gaming decentralized application (dApp) built for the Monad testnet. Features NFT minting, tap-to-earn gaming mechanics, and STL token staking.

## ✨ Features

- **🎨 NFT Minting**: Mint free Scuttle NFTs (only gas fee required)
- **🎮 Tap-to-Earn Game**: Click to earn STL tokens (1 STL per click)
- **💰 STL Token Staking**: Stake your STL tokens with multiple pool options
- **🔗 Web3 Integration**: Real blockchain transactions on Monad testnet
- **📱 Responsive Design**: Beautiful purple-themed UI that works on all devices

## 🔧 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Web3**: Wagmi, Viem, MetaMask integration
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM

## 🌐 Smart Contracts

- **NFT Contract**: `0x1e48772aD690310310Ed14e17F857bA1231b993e`
- **STL Token**: `0xCCa33DE1509eFd76E008eBe93d957f18C969baBf`
- **Staking Contract**: `0x103379cbaf24895c122bbd615c5a1e944621587b`

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MetaMask wallet
- Monad testnet setup

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Akayosan/Scuttle-dApp.git
   cd Scuttle-dApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5000`

### Monad Testnet Configuration

Add Monad testnet to MetaMask:
- **Network Name**: Monad Testnet
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Chain ID**: `10143`
- **Symbol**: `MON`
- **Block Explorer**: `https://testnet-explorer.monad.xyz`

## 🎯 How to Use

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask
2. **Switch Network**: Automatically switch to Monad testnet
3. **Mint NFT**: Get your free Scuttle NFT (only gas fee required)
4. **Play Game**: Tap the Scuttle image to earn STL tokens
5. **Withdraw**: Withdraw earned STL tokens to your wallet (min 1 STL)
6. **Stake**: Stake your STL tokens for rewards in different pools

## 💎 Game Features

### NFT Collection
- **Ultra Rare Scuttle NFTs**: Cute and adorable collectibles
- **Free Minting**: No minting fee, only network gas required
- **IPFS Storage**: Decentralized metadata storage

### Tap-to-Earn Game
- **Simple Mechanics**: Just click to earn
- **1 STL per Click**: Immediate reward system
- **Minimum Withdrawal**: 1 STL minimum to withdraw

### Staking Pools
- **30-day Pool**: Short-term staking option
- **90-day Pool**: Medium-term staking with better rewards
- **180-day Pool**: Long-term staking for maximum returns

## 🏗️ Project Structure

```
Scuttle-dApp/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configuration
│   │   └── pages/          # Page components
├── server/                 # Backend Express server
├── shared/                 # Shared types and schemas
└── package.json
```

## 🌟 Key Components

- **`use-web3.tsx`**: Web3 connection and wallet management
- **`use-contracts.tsx`**: Smart contract interactions
- **`nft-minting.tsx`**: NFT minting interface
- **`tap-to-earn.tsx`**: Game mechanics component
- **`staking-interface.tsx`**: Token staking functionality
- **`wallet-connection.tsx`**: Wallet connection UI

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Deploy to VPS

1. Build the project: `npm run build`
2. Upload to your VPS
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## 🎨 Design

Beautiful purple-themed design with:
- Gradient backgrounds
- Glowing effects
- Responsive layout
- Smooth animations
- Modern UI components

## 🔐 Security

- Real blockchain transactions
- Secure wallet integration
- No private key storage
- Client-side transaction signing

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Email: sarostoken@gmail.com
- GitHub Issues: [Create an issue](https://github.com/Akayosan/Scuttle-dApp/issues)

## 🌟 Acknowledgments

- Built with ❤️ for the Monad ecosystem
- Powered by modern Web3 technologies
- Designed for the NFT gaming community

---

**Enjoy playing Scuttle dApp! 🎮✨**