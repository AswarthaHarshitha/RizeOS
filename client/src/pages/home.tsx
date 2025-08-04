import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Briefcase, Users, TrendingUp, Zap, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobPostModal } from "@/components/JobPostModal";

export function Home() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  const { data: jobMatches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["/api/jobs/matches", "current-user"],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Professional Navigation Header */}
      <header className="nav-glass sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-brand rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">RizeOS</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Network</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 pb-4">Feed</a>
                <a href="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Jobs</a>
                <a href="/network" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Network</a>
                <a href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Profile</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{user?.firstName?.charAt(0) || 'U'}</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{user?.firstName || 'User'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Software Engineer</p>
                </div>
                <div className="status-online"></div>
              </div>
              
              <Button 
                onClick={() => setIsJobModalOpen(true)}
                className="gradient-brand hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Stats Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to the Future of Professional Networking
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              AI-powered job matching meets Web3 payments. Connect with opportunities, 
              get matched with perfect roles, and grow your career with transparency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="metric-card hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{Array.isArray(posts) ? posts.length : 0}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active Jobs</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium">+12%</span>
                <span className="text-gray-500 text-xs ml-1">this week</span>
              </div>
            </div>
            
            <div className="metric-card hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">1,247</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Professionals</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium">+8%</span>
                <span className="text-gray-500 text-xs ml-1">this month</span>
              </div>
            </div>
            
            <div className="metric-card hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">89%</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">AI Match Rate</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="ai-badge">AI Powered</span>
              </div>
            </div>
            
            <div className="metric-card hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">₹2.4L</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Salary</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="web3-badge">Web3 Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Featured Jobs Feed */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                    Featured Job Opportunities
                    <span className="ai-badge">AI Matched</span>
                  </h3>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </div>
              
              <div className="p-6">
                {postsLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(posts) && posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.slice(0, 3).map((post: any) => (
                      <div key={post.id} className="job-card p-0 border-0 bg-transparent">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                  {post.title || "Senior Full Stack Developer"}
                                </h4>
                                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                                  TechCorp India • Mumbai
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                  {post.content || "Join our innovative team building next-generation web applications with React, Node.js, and cutting-edge technologies."}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    Hybrid • Mumbai
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    ₹12-18 LPA
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    2 days ago
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {["React", "Node.js", "TypeScript", "AWS"].map((skill) => (
                                    <span key={skill} className="profile-badge">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="ai-badge pulse-success">95% Match</span>
                                <Button size="sm" className="gradient-brand">
                                  Apply Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No jobs posted yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Be the first to post a job and connect with top talent!
                    </p>
                    <Button 
                      onClick={() => setIsJobModalOpen(true)}
                      className="gradient-brand hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Sidebar */}
          <div className="space-y-6">
            {/* AI-Powered Matches */}
            <div className="feed-card ai-glow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  AI Job Matches
                  <span className="ai-badge">GPT-4o</span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Personalized matches based on your profile
                </p>
              </div>
              
              <div className="p-6">
                {matchesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(jobMatches) && jobMatches.length > 0 ? (
                  <div className="space-y-4">
                    {jobMatches.map((match: any, index: number) => (
                      <div key={index} className="hover-lift p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{match.title || "React Developer"}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{match.company || "TechCorp"}</p>
                          </div>
                          <span className="ai-badge pulse-success text-xs">
                            {match.score || 95}% Match
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Remote • ₹12-18 LPA</span>
                          <Button size="sm" variant="outline" className="text-xs">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Matching Ready</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Complete your profile to unlock AI-powered job recommendations
                    </p>
                    <Button size="sm" variant="outline">Complete Profile</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Trending in Tech */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trending Skills</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Most in-demand skills this week</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { skill: "React", growth: "+15%" },
                    { skill: "Node.js", growth: "+12%" },
                    { skill: "Python", growth: "+18%" },
                    { skill: "TypeScript", growth: "+22%" },
                    { skill: "AWS", growth: "+8%" },
                    { skill: "Docker", growth: "+10%" }
                  ].map(({ skill, growth }) => (
                    <div key={skill} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover-lift">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{skill}</span>
                        <span className="text-xs text-green-500 font-medium">{growth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Features */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Why RizeOS?</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">AI-Powered Matching</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Advanced algorithms find your perfect job fit</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-xs font-bold">₿</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Web3 Payments</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Transparent, secure blockchain transactions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Career Growth</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Personalized insights for professional development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <JobPostModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} />
    </div>
  );
}