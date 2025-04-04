
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrainCircuit, ArrowRight, Check, Zap, BarChart, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="bg-gradient-to-b from-background to-muted min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 bg-hero-pattern">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Navigate Your <span className="text-gradient">AI Career Path</span> with Confidence
              </h1>
              <p className="text-xl text-muted-foreground">
                Our AI-powered platform analyzes your skills, the job market, and industry trends to create a personalized career roadmap for success in the fast-evolving tech landscape.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth/register">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-future-purple/20 to-future-pink/20 rounded-2xl transform rotate-3 animate-pulse-glow"></div>
                <div className="relative bg-background border border-border p-8 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-xl">AI Career Analysis</h3>
                    </div>
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                      98% Match
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Your Top Career Paths</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-future-blue/10 flex items-center justify-center">
                              <BarChart className="h-4 w-4 text-future-blue" />
                            </div>
                            <span>Machine Learning Engineer</span>
                          </div>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-future-blue rounded-full" style={{width: "85%"}}></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-future-purple/10 flex items-center justify-center">
                              <Zap className="h-4 w-4 text-future-purple" />
                            </div>
                            <span>AI Product Manager</span>
                          </div>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-future-purple rounded-full" style={{width: "72%"}}></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-future-pink/10 flex items-center justify-center">
                              <Lightbulb className="h-4 w-4 text-future-pink" />
                            </div>
                            <span>AI Research Scientist</span>
                          </div>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-future-pink rounded-full" style={{width: "65%"}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Recommended Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1 bg-muted rounded-full text-xs font-medium">Python</div>
                        <div className="px-3 py-1 bg-muted rounded-full text-xs font-medium">TensorFlow</div>
                        <div className="px-3 py-1 bg-muted rounded-full text-xs font-medium">Data Analysis</div>
                        <div className="px-3 py-1 bg-muted rounded-full text-xs font-medium">Neural Networks</div>
                        <div className="px-3 py-1 bg-muted rounded-full text-xs font-medium">Natural Language Processing</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Powered Features for Your Career Growth
            </h2>
            <p className="text-xl text-muted-foreground">
              Our platform leverages advanced AI to provide insights and guidance tailored specifically to your career journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BrainCircuit className="h-6 w-6 text-future-purple" />,
                title: "AI Career Assessment",
                description: "Our AI analyzes your skills, experience, and preferences to identify the most promising career paths.",
              },
              {
                icon: <BarChart className="h-6 w-6 text-future-blue" />,
                title: "Market Trends Analysis",
                description: "Stay ahead with real-time analysis of industry trends and emerging opportunities in the AI field.",
              },
              {
                icon: <Zap className="h-6 w-6 text-future-pink" />,
                title: "Personalized Learning Paths",
                description: "Get customized learning recommendations to build the skills needed for your target roles.",
              },
              {
                icon: <Lightbulb className="h-6 w-6 text-future-purple" />,
                title: "AI Job Matching",
                description: "Our algorithms connect you with job opportunities that match your unique skill profile.",
              },
              {
                icon: <Check className="h-6 w-6 text-future-blue" />,
                title: "Resume Optimization",
                description: "AI-powered tools to enhance your resume and maximize your chances in the application process.",
              },
              {
                icon: <BrainCircuit className="h-6 w-6 text-future-pink" />,
                title: "Interview Preparation",
                description: "Practice with our AI assistant to prepare for technical interviews in AI and machine learning.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-lg border relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-future-pink/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Navigate Your Future in AI?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of professionals using our AI-powered platform to guide their career decisions.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth/register">
                    Start Free Assessment
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/tech-news">
                    Explore AI Trends
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
