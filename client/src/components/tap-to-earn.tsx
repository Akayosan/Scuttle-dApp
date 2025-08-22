import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useContracts } from '@/hooks/use-contracts';
import { useWeb3 } from '@/hooks/use-web3';
import { NFT_METADATA } from '@/lib/web3-config';
import { Gamepad2, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TapToEarn() {
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showClickEffect, setShowClickEffect] = useState(false);
  const { gameBalance, dailyClicks, tapToEarn, withdrawSTL } = useContracts();
  const { isConnected, isCorrectNetwork } = useWeb3();
  const { toast } = useToast();

  const handleTap = async () => {
    if (!isConnected || !isCorrectNetwork) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to play the game",
        variant: "destructive",
      });
      return;
    }

    const success = await tapToEarn();
    if (success) {
      setShowClickEffect(true);
      setTimeout(() => setShowClickEffect(false), 200);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount (minimum 1 STL)",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      const success = await withdrawSTL(amount);
      if (success) {
        setWithdrawAmount('');
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <section className="glass-effect rounded-2xl p-8 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-purple-accent">
          <Gamepad2 className="mr-3 h-8 w-8 inline" />
          Tap to Earn Game
        </h3>
        <p className="text-gray-300">Tap the Scuttle to earn STL tokens!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-center">
        {/* Game Stats */}
        <div className="space-y-4">
          <Card className="bg-purple-surface rounded-xl p-4 space-y-2">
            <div className="text-sm text-gray-400">Game Balance</div>
            <div className="text-2xl font-bold text-purple-accent">{gameBalance} STL</div>
          </Card>
          <Card className="bg-purple-surface rounded-xl p-4 space-y-2">
            <div className="text-sm text-gray-400">Clicks Today</div>
            <div className="text-xl font-semibold">{dailyClicks}</div>
          </Card>
          <Card className="bg-purple-surface rounded-xl p-4 space-y-2">
            <div className="text-sm text-gray-400">Per Click</div>
            <div className="text-xl font-semibold text-green-400">+1 STL</div>
          </Card>
        </div>

        {/* Game Area */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleTap}
            disabled={!isConnected || !isCorrectNetwork}
            className="tap-button relative w-32 h-32 mx-auto rounded-full gradient-bg flex items-center justify-center hover:shadow-2xl transform hover:scale-110 transition-all duration-200 animate-bounce-slow"
          >
            <img 
              src={NFT_METADATA.IMAGE_URL} 
              alt="Tap Scuttle" 
              className="w-20 h-20 rounded-full"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
              }}
            />
            {showClickEffect && (
              <div className="absolute inset-0 rounded-full border-4 border-purple-accent opacity-100 animate-ping" />
            )}
          </Button>
          <p className="text-sm text-gray-400">Click me to earn STL!</p>
        </div>

        {/* Withdraw Section */}
        <div className="space-y-4">
          <Card className="bg-purple-surface rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-2">Withdraw STL</div>
            <div className="text-xs text-yellow-400 mb-3">Minimum: 1 STL</div>
            <Input
              type="number"
              placeholder="Amount"
              min="1"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full bg-purple-dark border-purple-accent text-white mb-3"
            />
            <Button
              onClick={handleWithdraw}
              disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) < 1 || gameBalance < parseFloat(withdrawAmount)}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition-colors"
            >
              <Coins className="mr-2 h-4 w-4" />
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
            </Button>
          </Card>
        </div>
      </div>

      {(!isConnected || !isCorrectNetwork) && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
          <p className="text-yellow-400 text-sm">
            {!isConnected 
              ? "Please connect your wallet to play the game" 
              : "Please switch to Monad testnet"}
          </p>
        </div>
      )}
    </section>
  );
}
