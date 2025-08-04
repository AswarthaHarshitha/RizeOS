import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet, ExternalLink } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";

export default function WalletConnector() {
  const { isConnected, address, balance, walletType, connect, disconnect, isLoading, error } = useWallet();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async (type: 'metamask' | 'phantom') => {
    try {
      await connect(type);
      setIsOpen(false);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${type === 'metamask' ? 'MetaMask' : 'Phantom'}`,
      });
    } catch (err) {
      toast({
        title: "Connection Failed",
        description: error || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-success/10 text-success border-success/20 hover:bg-success/20"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Connected</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wallet Connected</DialogTitle>
            <DialogDescription>
              Your {walletType === 'metamask' ? 'MetaMask' : 'Phantom'} wallet is connected
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Address</span>
                <Badge variant="secondary" className="text-xs">
                  {walletType === 'metamask' ? 'MetaMask' : 'Phantom'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono break-all">
                {address}
              </p>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Balance</span>
                <span className="text-sm font-semibold">
                  {balance} {walletType === 'metamask' ? 'ETH' : 'SOL'}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(
                  walletType === 'metamask' 
                    ? `https://etherscan.io/address/${address}`
                    : `https://explorer.solana.com/address/${address}`,
                  '_blank'
                )}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect and start using Web3 features
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleConnect('metamask')}
            disabled={isLoading}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                🦊
              </div>
              <div className="text-left">
                <p className="font-medium">MetaMask</p>
                <p className="text-xs text-muted-foreground">
                  Ethereum & Polygon networks
                </p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleConnect('phantom')}
            disabled={isLoading}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                👻
              </div>
              <div className="text-left">
                <p className="font-medium">Phantom</p>
                <p className="text-xs text-muted-foreground">
                  Solana network
                </p>
              </div>
            </div>
          </Button>

          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
