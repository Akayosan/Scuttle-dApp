import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useContracts } from '@/hooks/use-contracts';
import { useWeb3 } from '@/hooks/use-web3';
import { TrendingUp, Lock, Unlock, Gift, InfoIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STAKING_POOLS = [
  {
    id: 0,
    name: '30-Day Pool',
    apy: '15%',
    lockPeriod: '30 days',
    minStake: '10 STL',
  },
  {
    id: 1,
    name: '90-Day Pool',
    apy: '25%',
    lockPeriod: '90 days',
    minStake: '50 STL',
  },
  {
    id: 2,
    name: '180-Day Pool',
    apy: '40%',
    lockPeriod: '180 days',
    minStake: '100 STL',
  },
];

export function StakingInterface() {
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [selectedPool, setSelectedPool] = useState(0);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [stakedAmount] = useState('0'); // In real app, fetch from contract
  const [earnedRewards] = useState('0'); // In real app, fetch from contract
  
  const { stlBalance, stakeSTL } = useContracts();
  const { isConnected, isCorrectNetwork } = useWeb3();
  const { toast } = useToast();

  const handleMaxStake = () => {
    setStakeAmount(stlBalance);
  };

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount",
        variant: "destructive",
      });
      return;
    }

    const minStake = parseFloat(STAKING_POOLS[selectedPool].minStake.split(' ')[0]);
    if (amount < minStake) {
      toast({
        title: "Amount Too Low",
        description: `Minimum stake for this pool is ${minStake} STL`,
        variant: "destructive",
      });
      return;
    }

    setIsStaking(true);
    try {
      const success = await stakeSTL(amount, selectedPool);
      if (success) {
        setStakeAmount('');
      }
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    setIsUnstaking(true);
    try {
      // In real implementation, call unstake contract method
      toast({
        title: "Unstaking Complete",
        description: "Successfully unstaked your STL tokens",
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  const handleClaimRewards = async () => {
    // In real implementation, call claim rewards contract method
    toast({
      title: "Rewards Claimed",
      description: "Successfully claimed your staking rewards",
    });
  };

  return (
    <section className="glass-effect rounded-2xl p-8 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-purple-accent">
          <TrendingUp className="mr-3 h-8 w-8 inline" />
          STL Token Staking
        </h3>
        <p className="text-gray-300">Stake your STL tokens to earn rewards</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Staking Interface */}
        <div className="space-y-6">
          <Card className="bg-purple-surface rounded-xl p-6 space-y-4">
            <h4 className="text-xl font-semibold">Stake STL Tokens</h4>
            
            {/* Available Balance */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Available Balance:</span>
              <span>{stlBalance} STL</span>
            </div>

            {/* Stake Amount Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount to Stake</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full bg-purple-dark border-purple-accent text-white pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMaxStake}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-accent text-sm font-semibold h-auto p-1"
                >
                  MAX
                </Button>
              </div>
            </div>

            {/* Stake Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleStake}
                disabled={isStaking || !stakeAmount || !isConnected || !isCorrectNetwork}
                className="gradient-bg py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Lock className="mr-2 h-4 w-4" />
                {isStaking ? 'Staking...' : 'Stake'}
              </Button>
              <Button
                onClick={handleUnstake}
                disabled={isUnstaking || stakedAmount === '0'}
                variant="destructive"
                className="py-3 rounded-lg font-semibold transition-colors"
              >
                <Unlock className="mr-2 h-4 w-4" />
                {isUnstaking ? 'Unstaking...' : 'Unstake'}
              </Button>
            </div>
          </Card>

          {/* Staking Pools */}
          <Card className="bg-purple-surface rounded-xl p-6 space-y-4">
            <h4 className="text-lg font-semibold">Staking Pools</h4>
            
            <div className="space-y-3">
              {STAKING_POOLS.map((pool) => (
                <Card
                  key={pool.id}
                  className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-all ${
                    selectedPool === pool.id
                      ? 'border-purple-accent bg-purple-accent/10'
                      : 'border-purple-accent/30 hover:border-purple-accent/60'
                  }`}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{pool.name}</span>
                    <span className="text-green-400 font-semibold">{pool.apy} APY</span>
                  </div>
                  <div className="text-sm text-gray-400 grid grid-cols-2 gap-4">
                    <div>Lock Period: <span className="text-white">{pool.lockPeriod}</span></div>
                    <div>Min Stake: <span className="text-white">{pool.minStake}</span></div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Staking Stats */}
        <div className="space-y-6">
          {/* Current Stakes */}
          <Card className="bg-purple-surface rounded-xl p-6 space-y-4">
            <h4 className="text-lg font-semibold">Your Stakes</h4>
            
            <div className="space-y-3">
              <Card className="bg-purple-dark rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Staked Amount</span>
                  <span className="font-semibold">{stakedAmount} STL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Rewards Earned</span>
                  <span className="text-green-400 font-semibold">{earnedRewards} STL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Time Remaining</span>
                  <span className="text-purple-accent">-</span>
                </div>
              </Card>
              
              <Button
                onClick={handleClaimRewards}
                disabled={earnedRewards === '0'}
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition-colors"
              >
                <Gift className="mr-2 h-4 w-4" />
                Claim Rewards
              </Button>
            </div>
          </Card>

          {/* Staking Info */}
          <Card className="bg-purple-surface rounded-xl p-6 space-y-4">
            <h4 className="text-lg font-semibold">
              <InfoIcon className="mr-2 h-5 w-5 inline" />
              How Staking Works
            </h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-accent rounded-full mt-2 flex-shrink-0"></div>
                <p>Stake your STL tokens to earn passive rewards</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-accent rounded-full mt-2 flex-shrink-0"></div>
                <p>Longer lock periods offer higher APY rates</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-accent rounded-full mt-2 flex-shrink-0"></div>
                <p>Rewards are calculated and distributed daily</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-accent rounded-full mt-2 flex-shrink-0"></div>
                <p>Early unstaking may incur penalties</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {(!isConnected || !isCorrectNetwork) && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
          <p className="text-yellow-400 text-sm">
            {!isConnected 
              ? "Please connect your wallet to access staking" 
              : "Please switch to Monad testnet"}
          </p>
        </div>
      )}
    </section>
  );
}
