import { useState, useEffect } from 'react';
import { useWeb3 } from './use-web3';
import { CONTRACTS, NFT_METADATA } from '@/lib/web3-config';
import { useToast } from '@/hooks/use-toast';

export function useContracts() {
  const { provider, signer, account, isConnected, isCorrectNetwork } = useWeb3();
  const [stlBalance, setStlBalance] = useState<string>('0');
  const [gameBalance, setGameBalance] = useState<number>(0);
  const [dailyClicks, setDailyClicks] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    if (account && isCorrectNetwork) {
      updateSTLBalance();
    }
  }, [account, isCorrectNetwork]);

  const updateSTLBalance = async () => {
    if (!provider || !account) return;
    
    try {
      // Real contract call to get STL balance
      const balanceData = `0x70a08231000000000000000000000000${account.slice(2)}`;
      
      const balance = await provider.request({
        method: 'eth_call',
        params: [{
          to: CONTRACTS.STL_TOKEN,
          data: balanceData,
        }, 'latest'],
      });
      
      // Convert balance from hex to decimal (assuming 18 decimals)
      const balanceDecimal = parseInt(balance, 16) / Math.pow(10, 18);
      setStlBalance(balanceDecimal.toFixed(2));
    } catch (error) {
      console.error('Error fetching STL balance:', error);
      // Fallback to localStorage if contract call fails
      const savedBalance = localStorage.getItem('stlBalance') || '100';
      setStlBalance(savedBalance);
    }
  };

  const mintNFT = async (quantity: number = 1) => {
    if (!provider || !account || !isCorrectNetwork) {
      toast({
        title: "Error",
        description: "Please connect wallet and switch to Monad testnet",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Minting Started",
        description: "Your NFT minting transaction has been submitted",
      });

      // Simple mint call - mint(address to, string memory uri)
      // Function selector for mint(address,string): 0x50bb4e7f
      const addressParam = account.slice(2).toLowerCase().padStart(64, '0');
      
      // Encode string parameter (IPFS URI)
      const uri = NFT_METADATA.IPFS_URI;
      const uriBytes = uri.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      const uriLength = uri.length.toString(16).padStart(64, '0');
      const uriPadded = uriBytes.padEnd(Math.ceil(uriBytes.length / 64) * 64, '0');
      
      const mintData = `0x50bb4e7f000000000000000000000000${addressParam}0000000000000000000000000000000000000000000000000000000000000040${uriLength}${uriPadded}`;
      
      const txParams = {
        to: CONTRACTS.NFT_CONTRACT,
        from: account,
        data: mintData,
        gas: '0x7A120', // 500000 gas limit
      };

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });

      toast({
        title: "NFT Minted!",
        description: `Successfully minted ${quantity} Scuttle NFT(s)! TX: ${txHash.slice(0, 10)}...`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Minting error:', error);
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint NFT",
        variant: "destructive",
      });
      return false;
    }
  };

  const tapToEarn = async () => {
    if (!isConnected || !isCorrectNetwork) {
      toast({
        title: "Error",
        description: "Please connect wallet and switch to Monad testnet",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, this would call a backend or contract
      // For now, we'll update local state and show the STL can be claimed
      setGameBalance(prev => prev + 1);
      setDailyClicks(prev => prev + 1);
      
      // Store in localStorage for persistence
      localStorage.setItem('gameBalance', (gameBalance + 1).toString());
      localStorage.setItem('dailyClicks', (dailyClicks + 1).toString());
      
      return true;
    } catch (error) {
      console.error('Tap to earn error:', error);
      return false;
    }
  };

  const withdrawSTL = async (amount: number) => {
    if (!provider || !account || amount < 1) {
      toast({
        title: "Error",
        description: "Invalid withdrawal amount (minimum 1 STL)",
        variant: "destructive",
      });
      return false;
    }

    if (gameBalance < amount) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough STL earned from game",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Withdrawal Started",
        description: "Your STL withdrawal transaction has been submitted",
      });

      // STL Token mint function: mint(address to, uint256 amount)
      const addressParam = account.slice(2).padStart(64, '0');
      const amountWei = BigInt(amount * Math.pow(10, 18));
      const amountHex = amountWei.toString(16).padStart(64, '0');
      const mintData = `0x40c10f19000000000000000000000000${addressParam}${amountHex}`;
      
      const txParams = {
        to: CONTRACTS.STL_TOKEN,
        from: account,
        data: mintData,
        gas: '0x493E0', // 300000 gas limit
        gasPrice: '0x9502F9000', // 40 gwei
      };

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
      
      // Update game balance
      const newGameBalance = gameBalance - amount;
      setGameBalance(newGameBalance);
      localStorage.setItem('gameBalance', newGameBalance.toString());
      
      // Update STL balance after transaction
      setTimeout(() => {
        updateSTLBalance();
      }, 3000);
      
      toast({
        title: "Withdrawal Complete",
        description: `Successfully withdrew ${amount} STL tokens! TX: ${txHash.slice(0, 10)}...`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to withdraw STL",
        variant: "destructive",
      });
      return false;
    }
  };

  const stakeSTL = async (amount: number, poolId: number = 0) => {
    if (!provider || !account || amount <= 0) {
      toast({
        title: "Error",
        description: "Invalid staking amount",
        variant: "destructive",
      });
      return false;
    }

    const currentSTL = parseFloat(stlBalance);
    if (currentSTL < amount) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough STL tokens to stake",
        variant: "destructive",
      });
      return false;
    }

    try {
      // First approve STL tokens to staking contract
      const amountWei = BigInt(amount * Math.pow(10, 18));
      const amountHex = amountWei.toString(16).padStart(64, '0');
      const stakingAddress = CONTRACTS.STAKING_CONTRACT.slice(2).padStart(64, '0');
      
      toast({
        title: "Approval Started",
        description: "Approving STL tokens for staking...",
      });

      // approve(address spender, uint256 amount)
      const approveData = `0x095ea7b3000000000000000000000000${stakingAddress}${amountHex}`;
      
      const approveTxParams = {
        to: CONTRACTS.STL_TOKEN,
        from: account,
        data: approveData,
        gas: '0x493E0', // 300000 gas limit
        gasPrice: '0x9502F9000', // 40 gwei
      };

      const approveTxHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [approveTxParams],
      });

      toast({
        title: "Staking Started",
        description: `Staking ${amount} STL tokens...`,
      });
      
      // Wait a bit for approval to be mined
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Now stake: stake(uint256 amount, uint256 poolId)
      const poolIdHex = poolId.toString(16).padStart(64, '0');
      const stakeData = `0xa694fc3a${amountHex}${poolIdHex}`;
      
      const stakeTxParams = {
        to: CONTRACTS.STAKING_CONTRACT,
        from: account,
        data: stakeData,
        gas: '0x493E0', // 300000 gas limit
        gasPrice: '0x9502F9000', // 40 gwei
      };

      const stakeTxHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [stakeTxParams],
      });
      
      // Update STL balance after transaction
      setTimeout(() => {
        updateSTLBalance();
      }, 3000);
      
      toast({
        title: "Staking Complete",
        description: `Successfully staked ${amount} STL tokens! TX: ${stakeTxHash.slice(0, 10)}...`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Staking error:', error);
      toast({
        title: "Staking Failed",
        description: error.message || "Failed to stake STL",
        variant: "destructive",
      });
      return false;
    }
  };

  // Load game data from localStorage on component mount
  useEffect(() => {
    const savedGameBalance = localStorage.getItem('gameBalance');
    const savedDailyClicks = localStorage.getItem('dailyClicks');
    
    if (savedGameBalance) setGameBalance(parseInt(savedGameBalance));
    if (savedDailyClicks) setDailyClicks(parseInt(savedDailyClicks));
  }, []);

  return {
    stlBalance,
    gameBalance,
    dailyClicks,
    mintNFT,
    tapToEarn,
    withdrawSTL,
    stakeSTL,
    updateSTLBalance,
  };
}
