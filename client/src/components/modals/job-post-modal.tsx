import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Sparkles, X } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { web3 } from "@/lib/web3";

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  isRemote: boolean;
  requiredSkills: string;
  description: string;
}

export default function JobPostModal({ isOpen, onClose }: JobPostModalProps) {
  const { user } = useAuth();
  const { isConnected, address, walletType, sendPayment } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    salaryRange: "",
    employmentType: "full-time",
    isRemote: false,
    requiredSkills: "",
    description: "",
  });

  const [paymentStep, setPaymentStep] = useState<"form" | "payment" | "processing" | "success">("form");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [txHash, setTxHash] = useState<string>("");

  const platformFee = walletType === 'phantom' ? '0.01' : '0.001';
  const currency = walletType === 'phantom' ? 'SOL' : 'ETH';
  const adminWallet = web3.getAdminWallet();

  // Enhanced job description mutation
  const enhanceDescriptionMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/jobs/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          skills: formData.requiredSkills.split(",").map(s => s.trim()),
        }),
      });
      if (!response.ok) throw new Error("Failed to enhance description");
      return response.json();
    },
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, description: data.enhancedDescription }));
      toast({
        title: "Description Enhanced!",
        description: "AI has improved your job description to attract better candidates.",
      });
    },
    onError: () => {
      toast({
        title: "Enhancement failed",
        description: "AI enhancement is temporarily unavailable.",
        variant: "destructive",
      });
    },
  });

  // Job creation mutation
  const createJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });
      if (!response.ok) throw new Error("Failed to create job");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setPaymentStep("success");
      setTimeout(() => {
        handleClose();
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Job creation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Payment verification mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) throw new Error("Payment verification failed");
      return response.json();
    },
    onSuccess: (payment) => {
      // Create the job after successful payment
      const jobData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(",").map(s => s.trim()),
        paymentTxHash: payment.txHash,
        paymentAmount: payment.amount,
      };
      createJobMutation.mutate(jobData);
    },
    onError: () => {
      toast({
        title: "Payment verification failed",
        description: "Please try the payment again.",
        variant: "destructive",
      });
      setPaymentStep("payment");
    },
  });

  const handleInputChange = (field: keyof JobFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnhanceDescription = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please add a job title and description first.",
        variant: "destructive",
      });
      return;
    }
    enhanceDescriptionMutation.mutate();
  };

  const handlePayment = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setPaymentStep("processing");

    try {
      const transactionHash = await sendPayment(platformFee, adminWallet);
      setTxHash(transactionHash);

      // Verify the payment
      verifyPaymentMutation.mutate({
        txHash: transactionHash,
        amount: platformFee,
        currency,
        blockchainNetwork: walletType === 'phantom' ? 'solana' : 'ethereum',
        purpose: 'job_posting',
      });

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "Transaction was rejected or failed.",
        variant: "destructive",
      });
      setPaymentStep("payment");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.company || !formData.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet required",
        description: "Please connect your wallet to post a job.",
        variant: "destructive",
      });
      return;
    }

    setPaymentStep("payment");
  };

  const handleClose = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      salaryRange: "",
      employmentType: "full-time",
      isRemote: false,
      requiredSkills: "",
      description: "",
    });
    setPaymentStep("form");
    setTxHash("");
    onClose();
  };

  const isFormValid = formData.title && formData.company && formData.description;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Post a Job</DialogTitle>
              <DialogDescription>
                Create a job posting with Web3 verification
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {paymentStep === "form" && (
            <>
              {/* Web3 Payment Notice */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Web3 Verification Required</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    To maintain quality and prevent spam, a small platform fee is required via blockchain payment.
                  </p>
                  
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Platform Fee:</span>
                      <span className="font-semibold text-gray-900 ml-2">
                        {platformFee} {currency} (~$2.50)
                      </span>
                    </div>
                    {isConnected ? (
                      <div className="flex items-center space-x-2 text-success">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">Wallet Connected</span>
                      </div>
                    ) : (
                      <Badge variant="destructive">Wallet Required</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Job Details Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Full-Stack Developer"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="input-professional"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="input-professional"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Remote, San Francisco, etc."
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="input-professional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryRange">Salary Range</Label>
                    <Input
                      id="salaryRange"
                      placeholder="$80k - $120k"
                      value={formData.salaryRange}
                      onChange={(e) => handleInputChange("salaryRange", e.target.value)}
                      className="input-professional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) => handleInputChange("employmentType", value)}
                    >
                      <SelectTrigger className="input-professional">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="isRemote"
                      checked={formData.isRemote}
                      onCheckedChange={(checked) => handleInputChange("isRemote", !!checked)}
                    />
                    <Label htmlFor="isRemote" className="text-sm">Remote work available</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="requiredSkills">Required Skills</Label>
                  <Input
                    id="requiredSkills"
                    placeholder="React, Node.js, Python, etc. (comma-separated)"
                    value={formData.requiredSkills}
                    onChange={(e) => handleInputChange("requiredSkills", e.target.value)}
                    className="input-professional"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    AI will automatically match candidates based on these skills
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    rows={6}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="input-professional resize-none"
                    required
                  />
                </div>

                {/* AI Enhancement */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">AI Enhancement</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Our AI will analyze your job description and suggest improvements to attract better candidates.
                    </p>
                    <Button
                      type="button"
                      onClick={handleEnhanceDescription}
                      disabled={enhanceDescriptionMutation.isPending || !formData.title || !formData.description}
                      className="bg-purple-600 text-white hover:bg-purple-700"
                    >
                      {enhanceDescriptionMutation.isPending ? "Enhancing..." : "Enhance with AI"}
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={!isFormValid || !isConnected}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </>
          )}

          {paymentStep === "payment" && (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Complete Payment</h3>
                <p className="text-gray-600">
                  Pay the platform fee to activate your job posting
                </p>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {platformFee} {currency}
                    </div>
                    <p className="text-sm text-gray-600">Platform fee (~$2.50 USD)</p>
                    <p className="text-xs text-gray-500">
                      Payment will be sent to: {adminWallet.slice(0, 10)}...
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPaymentStep("form")}
                >
                  Back to Form
                </Button>
                <Button
                  className="flex-1 btn-primary"
                  onClick={handlePayment}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Pay with {walletType === 'phantom' ? 'Phantom' : 'MetaMask'}
                </Button>
              </div>
            </div>
          )}

          {paymentStep === "processing" && (
            <div className="text-center space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
                <p className="text-gray-600">
                  Please wait while we verify your blockchain transaction...
                </p>
                {txHash && (
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    Transaction: {txHash.slice(0, 20)}...
                  </p>
                )}
              </div>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="text-center space-y-6">
              <div className="text-green-500 text-6xl">✓</div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-success">
                  Job Posted Successfully!
                </h3>
                <p className="text-gray-600">
                  Your job posting is now live and visible to candidates.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
