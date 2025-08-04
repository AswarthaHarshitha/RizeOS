import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase, TrendingUp, Users, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock job data for impressive display
const mockJobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "Microsoft India",
    logo: "M",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹25-35 LPA",
    posted: "2 hours ago",
    skills: ["React", "Node.js", "Azure", "TypeScript", "GraphQL"],
    description: "Join Microsoft's India development center working on cutting-edge cloud solutions...",
    applicants: 47,
    matchScore: 95,
    remote: true,
    urgent: true
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    company: "Google India",
    logo: "G",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹22-30 LPA",
    posted: "5 hours ago",
    skills: ["Python", "TensorFlow", "PyTorch", "Kubernetes", "GCP"],
    description: "Build next-generation AI models that impact billions of users worldwide...",
    applicants: 89,
    matchScore: 92,
    remote: false,
    urgent: false
  },
  {
    id: 3,
    title: "Blockchain Developer",
    company: "Polygon Technology",
    logo: "P",
    location: "Remote",
    type: "Contract",
    experience: "1-3 years",
    salary: "₹18-25 LPA",
    posted: "1 day ago",
    skills: ["Solidity", "Web3.js", "React", "Ethereum", "Smart Contracts"],
    description: "Shape the future of Web3 infrastructure with Polygon's scaling solutions...",
    applicants: 23,
    matchScore: 88,
    remote: true,
    urgent: false
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Swiggy",
    logo: "S",
    location: "Hyderabad, Telangana",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹15-22 LPA",
    posted: "3 days ago",
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
    description: "Scale India's largest food delivery platform serving millions daily...",
    applicants: 34,
    matchScore: 85,
    remote: false,
    urgent: true
  },
  {
    id: 5,
    title: "Product Manager",
    company: "Razorpay",
    logo: "R",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    experience: "4-7 years",
    salary: "₹28-40 LPA",
    posted: "1 week ago",
    skills: ["Product Strategy", "Analytics", "SQL", "User Research", "Agile"],
    description: "Lead product initiatives in India's fastest-growing fintech unicorn...",
    applicants: 67,
    matchScore: 78,
    remote: true,
    urgent: false
  }
];

export function Jobs() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");

  // Fetch AI-powered job matches
  const { data: jobMatches = [], isLoading } = useQuery({
    queryKey: ['/api/jobs/matches/current-user'],
    enabled: isAuthenticated
  });

  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);

  useEffect(() => {
    let filtered = Array.isArray(jobMatches) ? jobMatches : [];

    if (searchTerm) {
      filtered = filtered.filter((match: any) => 
        match.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (match.job.requiredSkills || []).some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedLocation && selectedLocation !== "all") {
      filtered = filtered.filter((match: any) => 
        selectedLocation === "remote" ? match.job.remote : match.job.location?.includes(selectedLocation)
      );
    }

    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter((match: any) => match.job.jobType === selectedType);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedLocation, selectedType, selectedExperience, jobMatches]);

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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Jobs Portal</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Feed</a>
                <a href="/jobs" className="text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 pb-4">Jobs</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Network</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Messages</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{user?.firstName?.charAt(0) || 'U'}</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{user?.firstName || 'User'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Looking for opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="feed-card mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="px-6">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Job Listings */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredJobs.length} Jobs Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Showing AI-matched opportunities for you
                </p>
              </div>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                  <SelectItem value="match">Best Match</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="job-card">
                    <div className="animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                          <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or check back later for new opportunities.</p>
              </div>
            ) : (
              filteredJobs.map((match: any) => {
                const job = match.job;
                return (
                  <div key={job.id} className="job-card">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">
                        {job.company?.charAt(0) || 'J'}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer">
                                {job.title}
                              </h3>
                              {job.remote && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Remote
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                              {job.company}
                            </p>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location || 'Location not specified'}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary || 'Salary not disclosed'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                              {job.description}
                            </p>
                            
                            {(job.requiredSkills || []).length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {(job.requiredSkills || []).slice(0, 5).map((skill: string) => (
                                  <span key={skill} className="profile-badge">
                                    {skill}
                                  </span>
                                ))}
                                {(job.requiredSkills || []).length > 5 && (
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    +{(job.requiredSkills || []).length - 5} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* AI Insights */}
                            {match.strengths && match.strengths.length > 0 && (
                              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                                <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">Your Strengths:</h4>
                                <p className="text-sm text-green-700 dark:text-green-400">{match.strengths.slice(0, 2).join(', ')}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                              <div className="ai-badge pulse-success mb-2">
                                {Math.round(match.matchScore)}% AI Match
                              </div>
                              <div className="flex items-center text-yellow-500 text-sm">
                                <Star className="h-4 w-4 mr-1" />
                                AI Recommended
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Save
                              </Button>
                              <Button className="gradient-brand">
                                Apply Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Alerts */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Job Alerts</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get notified about jobs matching your profile
                </p>
                <Button className="w-full gradient-brand">
                  Create Alert
                </Button>
              </div>
            </div>

            {/* Industry Insights */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Industry Insights</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tech Jobs</span>
                  <span className="text-green-500 text-sm">↑ 23%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Remote Work</span>
                  <span className="text-green-500 text-sm">↑ 45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI/ML Roles</span>
                  <span className="text-green-500 text-sm">↑ 67%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Web3 Jobs</span>
                  <span className="text-green-500 text-sm">↑ 89%</span>
                </div>
              </div>
            </div>

            {/* Salary Insights */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Salary Insights</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Your Skills Average</span>
                      <span className="font-semibold">₹24 LPA</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Average</span>
                      <span className="font-semibold">₹18 LPA</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}