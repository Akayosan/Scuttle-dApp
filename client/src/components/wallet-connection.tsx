import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/use-web3';
import { Wallet, ChevronDown } from 'lucide-react';
import { LOGO_URL } from '@/lib/web3-config';

export function WalletConnection() {
  const { 
    account, 
    isConnected, 
    isCorrectNetwork, 
    connectWallet, 
    switchToMonad, 
    loading 
  } = useWeb3();

  const handleWalletAction = async () => {
    if (!isConnected) {
      await connectWallet();
    } else if (!isCorrectNetwork) {
      await switchToMonad();
    }
  };

  const getButtonText = () => {
    if (loading) return 'Connecting...';
    if (!isConnected) return 'Connect Wallet';
    if (!isCorrectNetwork) return 'Switch to Monad';
    return `${account?.slice(0, 6)}...${account?.slice(-4)}`;
  };

  const getButtonVariant = () => {
    if (!isConnected || !isCorrectNetwork) return 'default';
    return 'outline';
  };

  return (
    <header className="relative z-10 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={LOGO_URL} 
            alt="Scuttle Logo" 
            className="w-12 h-12 rounded-full border-2 border-purple-accent"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
            }}
          />
          <div>
            <h1 className="text-2xl font-bold text-purple-accent">Scuttle</h1>
            <p className="text-sm text-gray-400">NFT Gaming dApp</p>
          </div>
        </div>
        
        <Button
          onClick={handleWalletAction}
          disabled={loading}
          variant={getButtonVariant()}
          className="gradient-bg px-6 py-3 rounded-xl font-semibold text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Wallet className="mr-2 h-4 w-4" />
          <span>{getButtonText()}</span>
          {isConnected && isCorrectNetwork && (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
