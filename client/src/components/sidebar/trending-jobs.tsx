import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import JobPostModal from "@/components/modals/job-post-modal";
import { useState } from "react";

export default function TrendingJobs() {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const response = await fetch("/api/jobs?limit=5");
      return response.json();
    },
  });

  return (
    <div className="space-y-6">
      {/* Trending Jobs */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg">Trending Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-b border-gray-100 pb-3 last:border-b-0">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))
          ) : (
            jobs?.slice(0, 3).map((job: any) => (
              <div key={job.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                <h4 className="font-medium text-sm text-gray-900">
                  {job.title}
                </h4>
                <p className="text-xs text-gray-500 mb-1">
                  {job.company} • {job.location || "Remote"}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-success font-medium">
                    {job.salaryRange}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
          <Button variant="link" size="sm" className="w-full p-0 h-auto text-primary">
            View all jobs →
          </Button>
        </CardContent>
      </Card>

      {/* Create Job Post CTA */}
      <Card className="gradient-success text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Post a Job</h3>
            <i className="fas fa-plus-circle text-lg"></i>
          </div>
          <p className="text-sm opacity-90 mb-4">
            Reach top talent with Web3-verified postings
          </p>
          <Button
            variant="secondary"
            className="w-full bg-white text-gray-900 hover:bg-gray-100"
            onClick={() => setIsJobModalOpen(true)}
          >
            Create Job Post
          </Button>
        </CardContent>
      </Card>

      {/* Network Suggestions */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg">People You May Know</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {i === 0 ? "EZ" : "DP"}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-900">
                  {i === 0 ? "Emily Zhang" : "David Park"}
                </h4>
                <p className="text-xs text-gray-500">
                  {i === 0 ? "UX Designer at DesignPro" : "Data Scientist at DataCorp"}
                </p>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                  + Connect
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <i className="fas fa-lightbulb text-purple-600"></i>
            <h3 className="font-semibold text-gray-900">AI Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-2">
                💡 Your profile gets 40% more views when you add portfolio links
              </p>
              <Button variant="link" size="sm" className="p-0 h-auto text-purple-600 text-xs">
                Add portfolio →
              </Button>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-2">
                🎯 Companies are actively looking for your React.js skills
              </p>
              <Button variant="link" size="sm" className="p-0 h-auto text-purple-600 text-xs">
                View opportunities →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <JobPostModal 
        isOpen={isJobModalOpen} 
        onClose={() => setIsJobModalOpen(false)} 
      />
    </div>
  );
}
