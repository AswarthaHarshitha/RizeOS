import React, { createContext, useContext, useState, useEffect } from "react";
import { web3 } from "@/lib/web3";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  walletType: 'metamask' | 'phantom' | null;
  connect: (type: 'metamask' | 'phantom') => Promise<void>;
  disconnect: () => void;
  sendPayment: (amount: string, recipient: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'metamask' | 'phantom' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async (type: 'metamask' | 'phantom') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await web3.connectWallet(type);
      setIsConnected(true);
      setAddress(result.address);
      setBalance(result.balance);
      setWalletType(type);
      
      // Store connection state
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletType', type);
      localStorage.setItem('walletAddress', result.address);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    setWalletType(null);
    setError(null);
    
    // Clear stored state
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletType');
    localStorage.removeItem('walletAddress');
  };

  const sendPayment = async (amount: string, recipient: string): Promise<string> => {
    if (!walletType || !address) {
      throw new Error('Wallet not connected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const txHash = await web3.sendTransaction(walletType, {
        to: recipient,
        value: amount,
        from: address,
      });
      
      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = async () => {
    if (!walletType || !address) return;
    
    try {
      const newBalance = await web3.getBalance(walletType, address);
      setBalance(newBalance);
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  };

  // Auto-connect on page load
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    const storedType = localStorage.getItem('walletType') as 'metamask' | 'phantom';
    const storedAddress = localStorage.getItem('walletAddress');
    
    if (wasConnected && storedType && storedAddress) {
      // Verify connection is still valid
      web3.isWalletConnected(storedType).then((connected) => {
        if (connected) {
          setIsConnected(true);
          setWalletType(storedType);
          setAddress(storedAddress);
          updateBalance();
        } else {
          disconnect();
        }
      });
    }
  }, []);

  // Update balance periodically
  useEffect(() => {
    if (isConnected && address && walletType) {
      const interval = setInterval(updateBalance, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isConnected, address, walletType]);

  const value: WalletContextType = {
    isConnected,
    address,
    balance,
    walletType,
    connect,
    disconnect,
    sendPayment,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
