import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useContracts } from '@/hooks/use-contracts';
import { useWeb3 } from '@/hooks/use-web3';
import { NFT_METADATA } from '@/lib/web3-config';
import { Plus, Minus, Hammer, Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function NFTMinting() {
  const [quantity, setQuantity] = useState(1);
  const [minting, setMinting] = useState(false);
  const { mintNFT } = useContracts();
  const { isConnected, isCorrectNetwork } = useWeb3();
  const { toast } = useToast();

  const pricePerNFT = 0;
  const totalPrice = "FREE";

  const handleMint = async () => {
    if (!isConnected || !isCorrectNetwork) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet and switch to Monad testnet",
        variant: "destructive",
      });
      return;
    }

    setMinting(true);
    try {
      const success = await mintNFT(quantity);
      if (success) {
        // Reset quantity after successful mint
        setQuantity(1);
      }
    } finally {
      setMinting(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <section className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-6xl font-bold gradient-bg bg-clip-text text-transparent">
          Mint Scuttle NFT
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover the ultra-rare and adorable Scuttle NFT collection on Monad testnet
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
        {/* NFT Preview Card */}
        <Card className="glass-effect rounded-2xl p-6 nft-glow border-purple-accent/20">
          <img 
            src={NFT_METADATA.IMAGE_URL} 
            alt="Scuttle NFT" 
            className="w-full rounded-xl mb-4 animate-pulse-slow"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
            }}
          />
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-purple-accent">{NFT_METADATA.NAME}</h3>
            <span className="inline-block gradient-bg px-4 py-2 rounded-full text-sm font-semibold">
              <Gem className="mr-2 h-4 w-4 inline" />
              {NFT_METADATA.RARITY}
            </span>
            <p className="text-gray-300 text-sm">
              A unique and adorable collectible on Monad blockchain
            </p>
          </div>
        </Card>

        {/* Minting Interface */}
        <Card className="glass-effect rounded-2xl p-6 space-y-6 border-purple-accent/20">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Mint Your Scuttle</h4>
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full bg-purple-surface border-purple-accent hover:bg-purple-accent"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold px-4">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
                className="w-10 h-10 rounded-full bg-purple-surface border-purple-accent hover:bg-purple-accent"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Price Display */}
            <div className="bg-purple-surface rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price per NFT:</span>
                <span className="text-green-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-green-400">{totalPrice}</span>
              </div>
              <div className="text-xs text-gray-400 text-center">
                Only gas fee (MON) required
              </div>
            </div>

            {/* Mint Button */}
            <Button
              onClick={handleMint}
              disabled={minting || !isConnected || !isCorrectNetwork}
              className="w-full gradient-bg py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Hammer className="mr-2 h-5 w-5" />
              {minting ? 'Minting...' : 'Mint Scuttle'}
            </Button>

            {/* Connection Status */}
            {(!isConnected || !isCorrectNetwork) && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-yellow-400 text-sm">
                  {!isConnected 
                    ? "Please connect your wallet to mint NFTs" 
                    : "Please switch to Monad testnet"}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
