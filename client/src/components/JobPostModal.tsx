import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, DollarSign, MapPin, Users, Briefcase, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requiredSkills: z.string().min(1, "Required skills are needed"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().min(1, "Salary range is required"),
  isRemote: z.boolean(),
  experienceLevel: z.enum(["entry", "mid", "senior"]),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JobPostModal({ isOpen, onClose }: JobPostModalProps) {
  const [currentStep, setCurrentStep] = useState<"details" | "payment">("details");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "connecting" | "paying" | "success">("idle");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      requiredSkills: "",
      location: "",
      salary: "",
      isRemote: false,
      experienceLevel: "mid",
    },
  });

  const createJobMutation = useMutation({
    mutationFn: (data: JobFormData & { paymentTxHash: string }) =>
      apiRequest("/api/jobs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Success!",
        description: "Your job has been posted successfully.",
      });
      onClose();
      form.reset();
      setCurrentStep("details");
      setPaymentStatus("idle");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post job",
        variant: "destructive",
      });
    },
  });

  const handlePayment = async () => {
    try {
      setPaymentStatus("connecting");
      
      // Check if MetaMask is available
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        setPaymentStatus("paying");
        
        // Simulate payment process
        const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64);
        
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setPaymentStatus("success");
        
        // Submit job with payment hash
        const formData = form.getValues();
        const skillsArray = formData.requiredSkills.split(",").map(s => s.trim());
        
        createJobMutation.mutate({
          ...formData,
          requiredSkills: skillsArray.join(", "),
          paymentTxHash: mockTxHash,
        });
        
      } else {
        toast({
          title: "Wallet Not Found",
          description: "Please install MetaMask or another Web3 wallet to continue.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setPaymentStatus("idle");
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: JobFormData) => {
    setCurrentStep("payment");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentStep === "details" ? "Post a Job" : "Complete Payment"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {currentStep === "details" ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="e.g., Senior Full Stack Developer"
                    className="mt-1"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    {...form.register("location")}
                    placeholder="e.g., Mumbai, India"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="salary" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Salary Range
                  </Label>
                  <Input
                    id="salary"
                    {...form.register("salary")}
                    placeholder="e.g., ₹8-15 LPA"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="experienceLevel" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Experience Level
                  </Label>
                  <select
                    id="experienceLevel"
                    {...form.register("experienceLevel")}
                    className="mt-1 w-full border border-input rounded-lg px-3 py-2 bg-background"
                  >
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRemote"
                    {...form.register("isRemote")}
                    className="rounded border-input"
                  />
                  <Label htmlFor="isRemote">Remote work available</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="requiredSkills" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Required Skills
                </Label>
                <Input
                  id="requiredSkills"
                  {...form.register("requiredSkills")}
                  placeholder="e.g., React, Node.js, TypeScript, PostgreSQL"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                  rows={6}
                  className="mt-1"
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Continue to Payment
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Platform Fee Required</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  To ensure quality job posts and prevent spam, we require a small platform fee of <strong>0.001 ETH</strong> (approximately ₹200).
                </p>
                <p className="text-sm text-gray-500">
                  This fee helps maintain a high-quality platform for both job seekers and employers.
                </p>
              </div>

              <div className="space-y-4">
                {paymentStatus === "idle" && (
                  <Button 
                    onClick={handlePayment}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                  >
                    Connect Wallet & Pay Fee
                  </Button>
                )}

                {paymentStatus === "connecting" && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span>Connecting to wallet...</span>
                  </div>
                )}

                {paymentStatus === "paying" && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full"></div>
                    <span>Processing payment...</span>
                  </div>
                )}

                {paymentStatus === "success" && (
                  <div className="text-green-600 font-semibold">
                    Payment successful! Posting your job...
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep("details")}
                  disabled={paymentStatus !== "idle"}
                >
                  Back to Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}