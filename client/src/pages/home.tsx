import { WalletConnection } from '@/components/wallet-connection';
import { NFTMinting } from '@/components/nft-minting';
import { TapToEarn } from '@/components/tap-to-earn';
import { StakingInterface } from '@/components/staking-interface';
import { NetworkInfo } from '@/components/network-info';

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-dark text-white">
      <WalletConnection />
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <NFTMinting />
        <TapToEarn />
        <StakingInterface />
        <NetworkInfo />
      </main>
    </div>
  );
}
