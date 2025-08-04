import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, Users, Briefcase, Eye, MousePointer, Clock, Award, Target, BarChart3, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export function Analytics() {
  const { user, isAuthenticated } = useAuth();

  // Fetch AI-powered career insights
  const { data: careerInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/ai/career-insights', user?.id],
    queryFn: async () => {
      return await apiRequest('/api/ai/career-insights', 'POST', {
        profile: `${user?.bio || ''} ${user?.title || ''}`,
        skills: user?.skills || [],
        experience: user?.title ? [user.title] : []
      });
    },
    enabled: isAuthenticated && !!user
  });

  // Fetch job matches for analytics
  const { data: jobMatches = [] } = useQuery({
    queryKey: ['/api/jobs/matches/current-user'],
    enabled: isAuthenticated
  });

  // Mock analytics data for impressive display
  const analyticsData = {
    profileViews: {
      total: 2847,
      thisWeek: 189,
      growth: 15.2
    },
    connections: {
      total: 1523,
      newThisMonth: 67,
      growth: 8.3
    },
    jobApplications: {
      sent: 23,
      responses: 8,
      interviews: 3
    },
    skillEndorsements: {
      received: 156,
      given: 89,
      topSkill: "React"
    },
    searchAppearances: {
      total: 342,
      rank: "Top 5%",
      improvement: 12
    },
    networkActivity: [
      { date: "Jan", views: 120, connections: 15, applications: 3 },
      { date: "Feb", views: 150, connections: 22, applications: 5 },
      { date: "Mar", views: 189, connections: 18, applications: 4 },
      { date: "Apr", views: 210, connections: 25, applications: 7 },
      { date: "May", views: 245, connections: 19, applications: 6 },
      { date: "Jun", views: 189, connections: 12, applications: 2 }
    ],
    industryComparison: {
      profileStrength: 92,
      industryAverage: 67,
      skillsMatch: 88,
      networkSize: 78
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Career Analytics</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Feed</a>
                <a href="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Jobs</a>
                <a href="/network" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Network</a>
                <a href="/analytics" className="text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 pb-4">Analytics</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{user?.firstName?.charAt(0) || 'U'}</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{user?.firstName || 'User'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Career Growth Tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="metric-card hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.profileViews.total.toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Profile Views</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium">+{analyticsData.profileViews.growth}%</span>
              <span className="text-gray-500 text-xs ml-1">vs last month</span>
            </div>
          </div>
          
          <div className="metric-card hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.connections.total.toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Connections</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium">+{analyticsData.connections.newThisMonth}</span>
              <span className="text-gray-500 text-xs ml-1">this month</span>
            </div>
          </div>
          
          <div className="metric-card hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.jobApplications.sent}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Applications</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-blue-500 text-sm font-medium">{analyticsData.jobApplications.responses} responses</span>
            </div>
          </div>
          
          <div className="metric-card hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.searchAppearances.rank}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Search Ranking</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="ai-badge">AI Optimized</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Performance */}
              <div className="feed-card">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Performance</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Profile Completeness</span>
                      <span className="text-sm text-gray-500">{analyticsData.industryComparison.profileStrength}%</span>
                    </div>
                    <Progress value={analyticsData.industryComparison.profileStrength} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Skills Match Rate</span>
                      <span className="text-sm text-gray-500">{analyticsData.industryComparison.skillsMatch}%</span>
                    </div>
                    <Progress value={analyticsData.industryComparison.skillsMatch} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Network Growth</span>
                      <span className="text-sm text-gray-500">{analyticsData.industryComparison.networkSize}%</span>
                    </div>
                    <Progress value={analyticsData.industryComparison.networkSize} className="h-3" />
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="feed-card">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">6-Month Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.networkActivity.map((month, index) => (
                      <div key={month.date} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-12">{month.date}</span>
                        <div className="flex-1 mx-4">
                          <div className="flex space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(month.views / 250) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(month.connections / 30) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{month.views} views</div>
                          <div>{month.connections} connections</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Application Funnel */}
              <div className="feed-card">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Application Funnel</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Applications Sent</span>
                    <span className="font-semibold">{analyticsData.jobApplications.sent}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Responses Received</span>
                    <span className="font-semibold">{analyticsData.jobApplications.responses}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interviews Scheduled</span>
                    <span className="font-semibold">{analyticsData.jobApplications.interviews}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '13%' }}></div>
                  </div>
                </div>
              </div>

              {/* Response Rate */}
              <div className="feed-card">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Success Metrics</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">34.8%</div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">13.0%</div>
                    <div className="text-sm text-gray-600">Interview Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">1.2x</div>
                    <div className="text-sm text-gray-600">Industry Average</div>
                  </div>
                </div>
              </div>

              {/* Top Performing Content */}
              <div className="feed-card">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Skills</h3>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { skill: "React", endorsements: 45, growth: "+12" },
                    { skill: "Node.js", endorsements: 38, growth: "+8" },
                    { skill: "TypeScript", endorsements: 32, growth: "+15" },
                    { skill: "Python", endorsements: 28, growth: "+6" }
                  ].map((item) => (
                    <div key={item.skill} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.skill}</div>
                        <div className="text-sm text-gray-500">{item.endorsements} endorsements</div>
                      </div>
                      <div className="text-green-500 text-sm font-medium">
                        {item.growth}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Skill Analytics</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "React", level: 90, demand: "Very High", trend: "↑", growth: "+15%" },
                    { name: "Node.js", level: 85, demand: "High", trend: "↑", growth: "+12%" },
                    { name: "TypeScript", level: 80, demand: "Very High", trend: "↑", growth: "+22%" },
                    { name: "Python", level: 75, demand: "High", trend: "↑", growth: "+18%" },
                    { name: "AWS", level: 70, demand: "Very High", trend: "↑", growth: "+8%" },
                    { name: "Docker", level: 65, demand: "Medium", trend: "↑", growth: "+10%" }
                  ].map((skill) => (
                    <div key={skill.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{skill.name}</h4>
                        <span className="text-green-500 font-medium">{skill.trend} {skill.growth}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Proficiency</span>
                          <span>{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                        <div className="text-sm text-gray-600">
                          Market Demand: <span className="font-medium">{skill.demand}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendations */}
              <div className="feed-card ai-glow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    AI Career Recommendations
                    <span className="ai-badge">GPT-4o</span>
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {insightsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : careerInsights ? (
                    <>
                      {(careerInsights as any).nextSteps?.slice(0, 3).map((step: string, index: number) => (
                        <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Next Step {index + 1}
                          </h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200">{step}</p>
                        </div>
                      ))}
                      
                      {(careerInsights as any).skillRecommendations?.slice(0, 2).map((skill: string, index: number) => (
                        <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                            Skill Recommendation
                          </h4>
                          <p className="text-sm text-green-800 dark:text-green-200">{skill}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        Complete your profile to get AI-powered career insights
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Market Trends */}
              <div className="feed-card">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Industry Trends</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">Remote Work</div>
                      <div className="text-sm text-gray-600">Job postings</div>
                    </div>
                    <div className="text-green-500 font-bold">↑ 45%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">AI/ML Roles</div>
                      <div className="text-sm text-gray-600">Market demand</div>
                    </div>
                    <div className="text-green-500 font-bold">↑ 67%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">Web3 Jobs</div>
                      <div className="text-sm text-gray-600">New positions</div>
                    </div>
                    <div className="text-green-500 font-bold">↑ 89%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">Full Stack</div>
                      <div className="text-sm text-gray-600">Salary growth</div>
                    </div>
                    <div className="text-green-500 font-bold">↑ 23%</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}