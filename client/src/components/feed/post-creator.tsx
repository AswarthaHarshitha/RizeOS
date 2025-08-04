import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Image, BarChart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import JobPostModal from "@/components/modals/job-post-modal";

export default function PostCreator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; type: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error("Failed to create post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setContent("");
      toast({
        title: "Post created!",
        description: "Your post has been shared with your network.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to create post",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPostMutation.mutate({
      content: content.trim(),
      type: "text",
    });
  };

  if (!user) return null;

  return (
    <>
      <Card className="card-soft mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profileImageUrl} alt={user.firstName} />
                <AvatarFallback>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Share your thoughts, achievements, or insights..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg resize-none"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsJobModalOpen(true)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary"
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">Post Job</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary"
                >
                  <Image className="h-4 w-4" />
                  <span className="text-sm">Media</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary"
                >
                  <BarChart className="h-4 w-4" />
                  <span className="text-sm">Poll</span>
                </Button>
              </div>
              <Button
                type="submit"
                className="btn-primary"
                disabled={!content.trim() || createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <JobPostModal 
        isOpen={isJobModalOpen} 
        onClose={() => setIsJobModalOpen(false)} 
      />
    </>
  );
}
