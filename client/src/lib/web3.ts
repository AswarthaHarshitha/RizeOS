interface Transaction {
  to: string;
  value: string;
  from: string;
  gas?: string;
  gasPrice?: string;
}

interface WalletConnection {
  address: string;
  balance: string;
}

// Enhanced Web3 service with native wallet APIs and ethers.js compatibility
import { ethers } from 'ethers';

class Web3Service {
  async connectWallet(type: 'metamask' | 'phantom'): Promise<WalletConnection> {
    if (type === 'metamask') {
      return this.connectMetaMask();
    } else {
      return this.connectPhantom();
    }
  }

  private async connectMetaMask(): Promise<WalletConnection> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      const balance = await this.getEthBalance(address);

      return { address, balance };
    } catch (error) {
      throw new Error(`MetaMask connection failed: ${error}`);
    }
  }

  private async connectPhantom(): Promise<WalletConnection> {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error('Phantom wallet not installed');
    }

    try {
      const resp = await window.solana.connect();
      const address = resp.publicKey.toString();
      const balance = await this.getSolanaBalance(address);

      return { address, balance };
    } catch (error) {
      throw new Error(`Phantom connection failed: ${error}`);
    }
  }

  async sendTransaction(type: 'metamask' | 'phantom', transaction: Transaction): Promise<string> {
    if (type === 'metamask') {
      return this.sendEthTransaction(transaction);
    } else {
      return this.sendSolanaTransaction(transaction);
    }
  }

  private async sendEthTransaction(transaction: Transaction): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: transaction.from,
          to: transaction.to,
          value: this.toHex(transaction.value),
          gas: transaction.gas || '0x5208', // 21000
          gasPrice: transaction.gasPrice || await this.getGasPrice(),
        }],
      });

      return txHash;
    } catch (error) {
      throw new Error(`Ethereum transaction failed: ${error}`);
    }
  }

  private async sendSolanaTransaction(transaction: Transaction): Promise<string> {
    if (!window.solana) {
      throw new Error('Phantom wallet not available');
    }

    try {
      // This is a simplified Solana transaction
      // In production, you would use @solana/web3.js
      const txHash = await window.solana.signAndSendTransaction({
        feePayer: transaction.from,
        instructions: [{
          keys: [
            { pubkey: transaction.from, isSigner: true, isWritable: true },
            { pubkey: transaction.to, isSigner: false, isWritable: true },
          ],
          programId: 'SystemProgram',
          data: Buffer.from('transfer'),
        }],
      });

      return txHash.signature;
    } catch (error) {
      throw new Error(`Solana transaction failed: ${error}`);
    }
  }

  async getBalance(type: 'metamask' | 'phantom', address: string): Promise<string> {
    if (type === 'metamask') {
      return this.getEthBalance(address);
    } else {
      return this.getSolanaBalance(address);
    }
  }

  private async getEthBalance(address: string): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });

      // Convert from wei to ETH
      const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
      return ethBalance.toFixed(4);
    } catch (error) {
      throw new Error(`Failed to get ETH balance: ${error}`);
    }
  }

  private async getSolanaBalance(address: string): Promise<string> {
    try {
      // In production, use actual Solana RPC
      // For now, return mock balance
      return "0.25";
    } catch (error) {
      throw new Error(`Failed to get SOL balance: ${error}`);
    }
  }

  async isWalletConnected(type: 'metamask' | 'phantom'): Promise<boolean> {
    if (type === 'metamask') {
      return !!(window.ethereum && window.ethereum.selectedAddress);
    } else {
      return !!(window.solana && window.solana.isConnected);
    }
  }

  private async getGasPrice(): Promise<string> {
    if (!window.ethereum) {
      return '0x4a817c800'; // 20 gwei default
    }

    try {
      const gasPrice = await window.ethereum.request({
        method: 'eth_gasPrice',
      });
      return gasPrice;
    } catch (error) {
      return '0x4a817c800'; // 20 gwei default
    }
  }

  private toHex(value: string): string {
    // Convert ETH to wei and then to hex
    const wei = parseFloat(value) * Math.pow(10, 18);
    return '0x' + wei.toString(16);
  }

  getPlatformFee(network: string): string {
    const fees = {
      ethereum: '0.001',
      polygon: '0.001',
      solana: '0.01',
    };
    return fees[network as keyof typeof fees] || '0.001';
  }

  getAdminWallet(): string {
    // In production, this would come from environment variables
    return '0x742d35Cc6634C0532925a3b8c17D49C8F47B';
  }
}

export const web3 = new Web3Service();

// Type declarations for wallet APIs
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      selectedAddress: string | null;
      isMetaMask?: boolean;
    };
    solana?: {
      isPhantom?: boolean;
      isConnected: boolean;
      publicKey: { toString: () => string };
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>;
    };
  }
}
