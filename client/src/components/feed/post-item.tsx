import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share, Bookmark } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import JobPost from "./job-post";

interface PostItemProps {
  post: {
    id: string;
    content: string;
    type: string;
    tags: string[];
    likes: number;
    comments: number;
    shares: number;
    createdAt: string;
    jobId?: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
      title?: string;
      profileImageUrl?: string;
    };
  };
}

export default function PostItem({ post }: PostItemProps) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to like post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate(post.id);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="card-soft animate-fade-in">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage 
              src={post.author.profileImageUrl} 
              alt={post.author.firstName} 
            />
            <AvatarFallback>
              {post.author.firstName?.[0]}{post.author.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-gray-900">
              {post.author.firstName} {post.author.lastName}
            </h4>
            <p className="text-sm text-gray-500">
              {post.author.title || "Professional"} • {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <CardContent className="p-4">
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Job Post Component */}
        {post.jobId && <JobPost jobId={post.jobId} />}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="badge-secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm">Like</span>
              <span className="text-sm">{post.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">Comment</span>
              <span className="text-sm">{post.comments}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Share className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
