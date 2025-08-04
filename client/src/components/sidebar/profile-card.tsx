import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";

export default function ProfileCard() {
  const { user } = useAuth();
  const { isConnected, address, balance, walletType } = useWallet();

  if (!user) return null;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="card-soft overflow-hidden">
        <div className="h-20 gradient-primary"></div>
        <CardContent className="px-4 pb-4 -mt-10">
          <Avatar className="w-20 h-20 border-4 border-white mb-3">
            <AvatarImage src={user.profileImageUrl} alt={user.firstName} />
            <AvatarFallback className="text-lg">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {user.title || "Professional"} | Web3 Enthusiast
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Profile Strength</span>
              <span className="text-success font-medium">
                {user.profileStrength}%
              </span>
            </div>
            <Progress value={user.profileStrength} className="h-2" />
          </div>

          {/* AI Skill Tags */}
          {user.skills && user.skills.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                AI-Detected Skills
              </h4>
              <div className="flex flex-wrap gap-1">
                {user.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="badge-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="card-soft">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Your Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Profile Views</span>
              <span className="font-semibold text-gray-900">247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Job Matches</span>
              <span className="font-semibold text-success">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Network</span>
              <span className="font-semibold text-gray-900">1,543</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Web3 Wallet Info */}
      {isConnected && address && (
        <Card className="gradient-primary text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Web3 Wallet</h3>
              <i className="fas fa-ethereum text-lg"></i>
            </div>
            <p className="text-sm opacity-90 mb-3 font-mono">
              {formatAddress(address)}
            </p>
            <div className="flex justify-between text-sm">
              <span>Balance:</span>
              <span className="font-medium">
                {balance} {walletType === 'metamask' ? 'ETH' : 'SOL'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
