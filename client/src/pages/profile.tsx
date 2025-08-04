import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Camera, MapPin, Calendar, Link as LinkIcon, Edit, Plus, Award, TrendingUp, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Mock profile data for impressive display
  const profileData = {
    name: "S. Harshitha",
    title: "Full Stack Developer & AI Enthusiast",
    company: "SRM University AP",
    location: "Amaravati, Andhra Pradesh",
    connections: 2847,
    followers: 1523,
    profileViews: 892,
    bio: "Passionate full-stack developer with expertise in React, Node.js, and emerging AI technologies. Currently pursuing B.Tech at SRM University AP while building innovative web applications and exploring the intersection of AI and Web3.",
    skills: [
      { name: "React", level: 90, endorsed: 45 },
      { name: "Node.js", level: 85, endorsed: 38 },
      { name: "TypeScript", level: 80, endorsed: 32 },
      { name: "Python", level: 75, endorsed: 28 },
      { name: "AI/ML", level: 70, endorsed: 24 },
      { name: "Web3", level: 65, endorsed: 19 }
    ],
    experience: [
      {
        title: "Full Stack Developer Intern",
        company: "TechCorp Solutions",
        duration: "Jun 2024 - Present",
        description: "Developed scalable web applications using React and Node.js, implemented AI-powered features, and contributed to blockchain integration projects."
      },
      {
        title: "AI Research Assistant",
        company: "SRM University AP",
        duration: "Jan 2024 - May 2024",
        description: "Researched machine learning algorithms for natural language processing, published research papers, and mentored junior students."
      }
    ],
    education: [
      {
        degree: "B.Tech Computer Science & Engineering",
        school: "SRM University AP",
        year: "2022 - 2026",
        grade: "CGPA: 9.2/10"
      }
    ],
    achievements: [
      "Winner - National Level Hackathon 2024",
      "Published Research Paper on AI Applications",
      "Google Cloud Certified Professional",
      "Microsoft Azure Fundamentals Certified"
    ],
    projects: [
      {
        name: "RizeOS Platform",
        description: "AI-powered professional networking platform with Web3 integration",
        tech: ["React", "Node.js", "PostgreSQL", "OpenAI", "Web3"]
      },
      {
        name: "SmartFinance AI",
        description: "Personal finance management app with AI-driven insights",
        tech: ["React Native", "Python", "TensorFlow", "Firebase"]
      }
    ]
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Profile</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Feed</a>
                <a href="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Jobs</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Network</a>
                <a href="/profile" className="text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 pb-4">Profile</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Save' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="feed-card">
              <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-xl"></div>
              <div className="p-6 -mt-16 relative">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-white">
                      {profileData.name.charAt(0)}
                    </div>
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 mt-16">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                          {profileData.name}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">
                          {profileData.title}
                        </p>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2 space-x-4">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {profileData.location}
                          </span>
                          <span className="flex items-center">
                            <LinkIcon className="h-4 w-4 mr-1" />
                            linkedin.com/in/s-harshitha-1aa69a258/
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button className="gradient-brand">
                          Connect
                        </Button>
                        <Button variant="outline">
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.connections}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connections</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.followers}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.profileViews}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Profile Views</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">About</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {profileData.bio}
                </p>
              </div>
            </div>

            {/* Experience Section */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Experience</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {exp.duration}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Projects</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {profileData.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover-lift">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {project.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Skills</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {profileData.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {skill.endorsed} endorsements
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Achievements</h3>
              </div>
              <div className="p-6 space-y-3">
                {profileData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {achievement}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Education</h3>
              </div>
              <div className="p-6">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">S</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h4>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {edu.school}
                      </p>
                      <p className="text-sm text-gray-500">
                        {edu.year} • {edu.grade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Analytics */}
            <div className="feed-card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Analytics</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profile Strength</span>
                  <span className="text-green-500 font-bold">Expert</span>
                </div>
                <Progress value={92} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-sm font-medium">Search Ranking</p>
                    <p className="text-xs text-gray-500">Top 5%</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-sm font-medium">Network Growth</p>
                    <p className="text-xs text-gray-500">+15% this month</p>
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