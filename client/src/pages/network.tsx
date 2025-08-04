import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Search, UserPlus, MessageCircle, MoreHorizontal, Users, TrendingUp, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock network data
const mockConnections = [
  {
    id: 1,
    name: "Rahul Sharma",
    title: "Senior Software Engineer",
    company: "Google India",
    location: "Bangalore",
    avatar: "R",
    mutualConnections: 23,
    skills: ["React", "Python", "AWS"],
    isConnected: true,
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "Priya Patel",
    title: "Product Manager",
    company: "Microsoft",
    location: "Mumbai",
    avatar: "P",
    mutualConnections: 18,
    skills: ["Product Strategy", "Analytics", "Agile"],
    isConnected: true,
    lastActive: "1 day ago"
  },
  {
    id: 3,
    name: "Arjun Kumar",
    title: "AI/ML Engineer",
    company: "OpenAI",
    location: "Remote",
    avatar: "A",
    mutualConnections: 31,
    skills: ["Machine Learning", "TensorFlow", "Python"],
    isConnected: false,
    lastActive: "5 hours ago"
  }
];

const mockSuggestions = [
  {
    id: 4,
    name: "Sneha Reddy",
    title: "Full Stack Developer",
    company: "Swiggy",
    location: "Hyderabad",
    avatar: "S",
    mutualConnections: 12,
    skills: ["Node.js", "MongoDB", "React"],
    reason: "Works at Swiggy and has similar skills"
  },
  {
    id: 5,
    name: "Vikram Singh",
    title: "DevOps Engineer",
    company: "Razorpay",
    location: "Bangalore",
    avatar: "V",
    mutualConnections: 8,
    skills: ["Kubernetes", "Docker", "AWS"],
    reason: "Connected to 8 of your connections"
  },
  {
    id: 6,
    name: "Ananya Gupta",
    title: "UX Designer",
    company: "Zomato",
    location: "Delhi",
    avatar: "A",
    mutualConnections: 15,
    skills: ["Figma", "User Research", "Prototyping"],
    reason: "Also attended SRM University"
  }
];

const mockCompanies = [
  {
    id: 1,
    name: "Google India",
    employees: 1247,
    followers: 45000,
    logo: "G",
    industry: "Technology",
    isFollowing: true
  },
  {
    id: 2,
    name: "Microsoft India",
    employees: 892,
    followers: 38000,
    logo: "M",
    industry: "Technology",
    isFollowing: false
  },
  {
    id: 3,
    name: "Swiggy",
    employees: 567,
    followers: 22000,
    logo: "S",
    industry: "Food Tech",
    isFollowing: true
  }
];

export function Network() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("connections");

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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Network</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Feed</a>
                <a href="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Jobs</a>
                <a href="/network" className="text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 pb-4">Network</a>
                <a href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Profile</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search your network..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="metric-card hover-lift text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">2,847</p>
            <p className="text-gray-600 dark:text-gray-400">Connections</p>
          </div>
          
          <div className="metric-card hover-lift text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">89</p>
            <p className="text-gray-600 dark:text-gray-400">New This Week</p>
          </div>
          
          <div className="metric-card hover-lift text-center">
            <Building className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
            <p className="text-gray-600 dark:text-gray-400">Companies</p>
          </div>
          
          <div className="metric-card hover-lift text-center">
            <MessageCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">34</p>
            <p className="text-gray-600 dark:text-gray-400">Messages</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connections">My Connections</TabsTrigger>
                <TabsTrigger value="suggestions">People You May Know</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
              </TabsList>

              <TabsContent value="connections" className="mt-6">
                <div className="feed-card">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Your Connections ({mockConnections.length})
                      </h2>
                      <Button variant="outline">
                        Manage Connections
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {mockConnections.map((connection) => (
                      <div key={connection.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover-lift">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {connection.avatar}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {connection.name}
                              </h3>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">
                                {connection.title}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {connection.company}
                              </p>
                              <div className="flex items-center text-gray-500 text-sm mt-1 space-x-4">
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {connection.location}
                                </span>
                                <span>{connection.mutualConnections} mutual connections</span>
                                <span>Active {connection.lastActive}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {connection.skills.map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="suggestions" className="mt-6">
                <div className="feed-card">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      People You May Know
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Based on your profile, location, and mutual connections
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {mockSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover-lift">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {suggestion.avatar}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {suggestion.name}
                              </h3>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">
                                {suggestion.title}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {suggestion.company}
                              </p>
                              <div className="flex items-center text-gray-500 text-sm mt-1 space-x-4">
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {suggestion.location}
                                </span>
                                <span>{suggestion.mutualConnections} mutual connections</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 italic">
                                {suggestion.reason}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {suggestion.skills.map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button size="sm" className="gradient-brand">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Connect
                              </Button>
                              <Button size="sm" variant="outline">
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="companies" className="mt-6">
                <div className="feed-card">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Companies to Follow
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Stay updated with industry leaders and potential employers
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {mockCompanies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover-lift">
                        <div className="w-16 h-16 gradient-brand rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {company.logo}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {company.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                {company.industry}
                              </p>
                              <div className="flex items-center text-gray-500 text-sm mt-2 space-x-4">
                                <span>{company.employees.toLocaleString()} employees</span>
                                <span>{company.followers.toLocaleString()} followers</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant={company.isFollowing ? "outline" : "default"}
                                className={company.isFollowing ? "" : "gradient-brand"}
                              >
                                {company.isFollowing ? "Following" : "Follow"}
                              </Button>
                              <Button size="sm" variant="outline">
                                View Jobs
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Network Activity */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">Rahul Sharma</p>
                  <p className="text-gray-600 dark:text-gray-400">Updated his profile</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">Priya Patel</p>
                  <p className="text-gray-600 dark:text-gray-400">Started a new position</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">Arjun Kumar</p>
                  <p className="text-gray-600 dark:text-gray-400">Published an article</p>
                  <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                </div>
              </div>
            </div>

            {/* Network Growth */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Network Growth</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="text-green-500 font-medium">+89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="text-green-500 font-medium">+324</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Growth</span>
                    <span className="text-blue-600 font-medium">+1,247</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Connections
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="h-4 w-4 mr-2" />
                  Follow Companies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}