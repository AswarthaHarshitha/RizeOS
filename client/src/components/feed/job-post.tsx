import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface JobPostProps {
  jobId: string;
}

export default function JobPost({ jobId }: JobPostProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: job, isLoading } = useQuery({
    queryKey: ["/api/jobs", jobId],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) throw new Error("Failed to fetch job");
      return response.json();
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });
      if (!response.ok) throw new Error("Failed to apply");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the employer.",
      });
    },
    onError: () => {
      toast({
        title: "Application failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-50 border border-gray-200 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-64 mb-2" />
          <div className="flex space-x-2 mb-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex space-x-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return null;
  }

  const handleApply = () => {
    applyMutation.mutate(jobId);
  };

  return (
    <Card className="bg-gray-50 border border-gray-200 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-semibold text-gray-900">{job.title}</h5>
          {job.paymentStatus === "paid" && (
            <Badge className="bg-success text-white text-xs">
              Web3 Payment Required
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {job.company} • {job.location || "Remote"} • {job.salaryRange}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {job.requiredSkills?.slice(0, 4).map((skill: string) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex space-x-3">
          <Button
            size="sm"
            className="btn-primary"
            onClick={handleApply}
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending ? "Applying..." : "Quick Apply"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="btn-outline"
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
