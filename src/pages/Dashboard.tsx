
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ModelCard from "@/components/AIModels/ModelCard";
import SubscriptionModal from "@/components/AIModels/SubscriptionModal";
import { EmailVerificationBanner } from "@/components/auth/AuthForms";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Rocket,
  TrendingUp,
  Award,
  LineChart,
  Briefcase,
  BookOpen,
  Users,
  Bell,
  Calendar,
  Layers
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data for widgets
const skillsData = [
  { name: "Machine Learning", progress: 65 },
  { name: "Data Science", progress: 48 },
  { name: "NLP", progress: 72 },
  { name: "Deep Learning", progress: 35 }
];

const upcomingEvents = [
  { id: 1, title: "AI Career Workshop", date: "Apr 10, 2025", type: "Workshop" },
  { id: 2, title: "Machine Learning Certification", date: "Apr 15, 2025", type: "Exam" },
  { id: 3, title: "Tech Conference", date: "Apr 22, 2025", type: "Conference" }
];

const careerPaths = [
  { id: 1, title: "Machine Learning Engineer", match: 87, new: true },
  { id: 2, title: "Data Scientist", match: 74, new: false },
  { id: 3, title: "AI Research Scientist", match: 65, new: true }
];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState(45);

  // Simulate progress update
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progress + 1 > 100 ? 0 : progress + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [progress]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const handleUseModel = (isPremium: boolean) => {
    if (isPremium && user?.subscription !== "premium") {
      setIsModalOpen(true);
    } else {
      toast({
        title: "Model activated",
        description: `You're now using the ${isPremium ? "Premium" : "Basic"} AI model.`,
      });
      
      // Navigation is now handled directly in the ModelCard component
    }
  };

  const freeModelFeatures = [
    { name: "Basic career path suggestions", included: true },
    { name: "General skill assessments", included: true },
    { name: "Industry trends overview", included: true },
    { name: "Limited job recommendations", included: true },
    { name: "Personalized learning paths", included: false },
    { name: "Advanced skill gap analysis", included: false },
    { name: "Resume & interview optimization", included: false },
  ];

  const premiumModelFeatures = [
    { name: "Basic career path suggestions", included: true },
    { name: "General skill assessments", included: true },
    { name: "Industry trends overview", included: true },
    { name: "Unlimited job recommendations", included: true },
    { name: "Personalized learning paths", included: true },
    { name: "Advanced skill gap analysis", included: true },
    { name: "Resume & interview optimization", included: true },
  ];

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <>
      <EmailVerificationBanner />
      
      <div className="bg-[#0c0c14] pt-6 pb-12 min-h-[calc(100vh-64px)]">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl font-bold">
              Hi, <span className="text-gradient">{user.name}</span>
            </h1>
            <p className="text-muted-foreground">
              Welcome to your Luminova AI career dashboard. Let's accelerate your career growth.
            </p>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-muted/30 pb-2">
            <button 
              className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'overview' ? 'bg-primary/20 text-primary' : 'hover:bg-muted/20'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'models' ? 'bg-primary/20 text-primary' : 'hover:bg-muted/20'}`}
              onClick={() => setActiveTab('models')}
            >
              AI Models
            </button>
            <button 
              className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'learning' ? 'bg-primary/20 text-primary' : 'hover:bg-muted/20'}`}
              onClick={() => setActiveTab('learning')}
            >
              Learning
            </button>
          </div>
          
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="bg-[#1a1a2e] border-primary/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">AI Career Growth Score</p>
                      <h3 className="text-2xl font-bold">{progress}%</h3>
                      <Progress value={progress} className="h-1 mt-1 bg-muted/20" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1a1a2e] border-primary/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Skills Mastered</p>
                      <h3 className="text-2xl font-bold">3 / 12</h3>
                      <Progress value={25} className="h-1 mt-1 bg-muted/20" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1a1a2e] border-primary/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Job Match Accuracy</p>
                      <h3 className="text-2xl font-bold">87%</h3>
                      <Progress value={87} className="h-1 mt-1 bg-muted/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <Card className="bg-[#1a1a2e] border-primary/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <Users size={18} className="text-primary" />
                          Career Matches
                        </CardTitle>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          AI Powered
                        </span>
                      </div>
                      <CardDescription>Careers that match your profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {careerPaths.map(path => (
                          <div key={path.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/10 transition-colors">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{path.title}</h4>
                                {path.new && (
                                  <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">Match Score: {path.match}%</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-medium text-xs">{path.match}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Middle Column */}
                <div className="space-y-6">
                  <Card className="bg-[#1a1a2e] border-primary/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <LineChart size={18} className="text-primary" />
                          Skills Assessment
                        </CardTitle>
                      </div>
                      <CardDescription>Your technical skills evaluation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {skillsData.map((skill, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{skill.name}</span>
                              <span className="text-primary">{skill.progress}%</span>
                            </div>
                            <Progress value={skill.progress} className="h-1.5 bg-muted/20" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <Card className="bg-[#1a1a2e] border-primary/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <Calendar size={18} className="text-primary" />
                          Upcoming Events
                        </CardTitle>
                      </div>
                      <CardDescription>Career events and deadlines</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {upcomingEvents.map(event => (
                          <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/10 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                              {event.type === 'Workshop' && <Users size={16} />}
                              {event.type === 'Exam' && <BookOpen size={16} />}
                              {event.type === 'Conference' && <Layers size={16} />}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{event.title}</h4>
                              <p className="text-xs text-muted-foreground">{event.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#1a1a2e] border-primary/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <Bell size={18} className="text-primary" />
                          Notifications
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-sm">Your resume analysis is complete. View insights now.</p>
                        </div>
                        <div className="p-2 rounded-lg hover:bg-muted/10 transition-colors">
                          <p className="text-sm">New AI course recommendation based on your profile.</p>
                        </div>
                        <div className="p-2 rounded-lg hover:bg-muted/10 transition-colors">
                          <p className="text-sm">Career insight: 3 trending skills in your field.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'models' && (
            <div className="grid md:grid-cols-2 gap-8">
              <ModelCard
                id="free"
                name="Luminova Basic"
                description="Get started with AI-powered career guidance and skill assessments."
                isPremium={false}
                price="$0"
                features={freeModelFeatures}
                onUse={() => handleUseModel(false)}
                onSubscribe={() => setIsModalOpen(true)}
              />
              
              <ModelCard
                id="premium"
                name="Luminova Pro"
                description="Advanced career insights with personalized learning paths and job matching."
                isPremium={true}
                price="$5"
                features={premiumModelFeatures}
                onUse={() => handleUseModel(true)}
                onSubscribe={() => setIsModalOpen(true)}
              />
            
              <div className="md:col-span-2 mt-8 bg-[#1a1a2e] p-6 rounded-lg border border-primary/10">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-primary" />
                      Your Subscription Status
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {user.subscription === "premium" 
                        ? "You have access to all premium features. Make the most of your subscription!" 
                        : "You're currently using the free plan. Upgrade to access premium features!"}
                    </p>
                    <div className="text-sm space-y-1">
                      <p><strong>Current Plan:</strong> {user.subscription === "premium" ? "Luminova Pro" : "Luminova Basic"}</p>
                      {user.subscription === "premium" && (
                        <p><strong>Next Billing Date:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="md:w-1/3 flex justify-center md:justify-end">
                    {user.subscription !== "premium" && (
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors animate-pulse-glow"
                      >
                        Upgrade to Premium
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'learning' && (
            <div className="space-y-6">
              <Card className="bg-[#1a1a2e] border-primary/10">
                <CardHeader>
                  <CardTitle>Learning Recommendations</CardTitle>
                  <CardDescription>
                    Personalized courses and resources to advance your career
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-muted/10 rounded-lg p-4 hover:bg-muted/20 transition-all border border-muted/20">
                      <div className="text-primary mb-2">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium mb-1">Machine Learning Fundamentals</h3>
                      <p className="text-sm text-muted-foreground mb-2">Learn the core concepts of ML algorithms and applications</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Difficulty: Intermediate</span>
                        <span className="text-primary">8 weeks</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/10 rounded-lg p-4 hover:bg-muted/20 transition-all border border-muted/20">
                      <div className="text-primary mb-2">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium mb-1">NLP for Beginners</h3>
                      <p className="text-sm text-muted-foreground mb-2">Introduction to processing and understanding language with AI</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Difficulty: Beginner</span>
                        <span className="text-primary">6 weeks</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/10 rounded-lg p-4 hover:bg-muted/20 transition-all border border-muted/20">
                      <div className="text-primary mb-2">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium mb-1">Deep Learning with PyTorch</h3>
                      <p className="text-sm text-muted-foreground mb-2">Build neural networks for real-world applications</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Difficulty: Advanced</span>
                        <span className="text-primary">10 weeks</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1a1a2e] border-primary/10">
                <CardHeader>
                  <CardTitle>Skill Development Plan</CardTitle>
                  <CardDescription>
                    Your personalized roadmap to advance your AI career
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-500">1</div>
                        <h3 className="font-medium">Foundations (Current Phase)</h3>
                      </div>
                      <div className="ml-10 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <p className="text-sm">Python Programming <span className="text-green-500 text-xs">(Completed)</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <p className="text-sm">Data Structures <span className="text-primary text-xs">(In Progress - 75%)</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-muted"></div>
                          <p className="text-sm">Basic Statistics</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/20 text-muted-foreground">2</div>
                        <h3 className="font-medium text-muted-foreground">Intermediate Skills</h3>
                      </div>
                      <div className="ml-10 space-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-muted"></div>
                          <p className="text-sm">Machine Learning Algorithms</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-muted"></div>
                          <p className="text-sm">Data Visualization</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/20 text-muted-foreground">3</div>
                        <h3 className="font-medium text-muted-foreground">Advanced Specialization</h3>
                      </div>
                      <div className="ml-10 space-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-muted"></div>
                          <p className="text-sm">Deep Learning</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-muted"></div>
                          <p className="text-sm">NLP & LLMs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Dashboard;
