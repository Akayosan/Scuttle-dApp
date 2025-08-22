import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MONAD_TESTNET } from '@/lib/web3-config';
import { useToast } from '@/hooks/use-toast';

interface Web3ContextType {
  provider: any | null;
  signer: any | null;
  account: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  switchToMonad: () => Promise<void>;
  loading: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<any | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkNetwork = async () => {
    try {
      if (!window.ethereum) return false;
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isCorrect = parseInt(chainId, 16) === MONAD_TESTNET.chainIdNumber;
      setIsCorrectNetwork(isCorrect);
      return isCorrect;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  };

  const switchToMonad = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to use this dApp",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET],
          });
        } catch (addError) {
          toast({
            title: "Network Error",
            description: "Failed to add Monad testnet to MetaMask",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Network Switch Error",
          description: "Failed to switch to Monad testnet",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to use this dApp",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setProvider(window.ethereum);
        setSigner(window.ethereum);
        setAccount(accounts[0]);
        setIsConnected(true);
        
        const isCorrect = await checkNetwork();
        if (!isCorrect) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Monad testnet",
            variant: "destructive",
          });
        }

        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setProvider(null);
          setSigner(null);
          setAccount(null);
          setIsConnected(false);
          setIsCorrectNetwork(false);
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        isConnected,
        isCorrectNetwork,
        connectWallet,
        switchToMonad,
        loading,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
