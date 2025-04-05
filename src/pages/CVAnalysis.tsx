
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Briefcase, Search, CheckCircle } from "lucide-react";

const CVAnalysis = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    skills: string[];
    jobTitles: string[];
    matchedJobs: any[];
  } | null>(null);
  const [manualSkills, setManualSkills] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF file"
        });
        return;
      }
      
      setFile(selectedFile);
      toast({
        title: "CV uploaded",
        description: `File "${selectedFile.name}" is ready for analysis`
      });
    }
  };

  const handleAnalysis = () => {
    if (!file && !manualSkills) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please upload a CV or enter your skills manually"
      });
      return;
    }

    setLoading(true);
    setProgress(0);
    
    // Simulate analysis process with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          simulateResults();
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const simulateResults = () => {
    // This is a placeholder for the actual Python model integration
    // In a real implementation, you would send the file to a backend API
    // that runs your Python model and returns the results
    
    // For demo purposes, we'll generate mock results
    setTimeout(() => {
      const mockSkills = manualSkills 
        ? manualSkills.split(",").map(skill => skill.trim()) 
        : ["Python", "JavaScript", "React", "Data Analysis", "Machine Learning"];
      
      const mockResults = {
        skills: mockSkills,
        jobTitles: ["Software Engineer", "Data Scientist", "Frontend Developer"],
        matchedJobs: [
          {
            title: "Senior Software Engineer",
            company: "TechCorp Inc.",
            location: "Cairo, Egypt",
            matchPercentage: 92,
            link: "https://example.com/job1",
            source: "Wuzzuf"
          },
          {
            title: "Frontend Developer",
            company: "WebSolutions LLC",
            location: "Remote",
            matchPercentage: 87,
            link: "https://example.com/job2",
            source: "LinkedIn"
          },
          {
            title: "Data Scientist",
            company: "DataMinds",
            location: "Alexandria, Egypt",
            matchPercentage: 84,
            link: "https://example.com/job3",
            source: "Bayt"
          },
          {
            title: "Full Stack Developer",
            company: "Innovate Tech",
            location: "Cairo, Egypt",
            matchPercentage: 78,
            link: "https://example.com/job4",
            source: "Wuzzuf"
          },
          {
            title: "AI Engineer",
            company: "Future AI",
            location: "Giza, Egypt",
            matchPercentage: 72,
            link: "https://example.com/job5",
            source: "LinkedIn"
          }
        ]
      };
      
      setResults(mockResults);
      setLoading(false);
      
      toast({
        title: "Analysis complete",
        description: `Found ${mockResults.matchedJobs.length} matching job opportunities`,
      });
    }, 1000);
  };

  return (
    <div className="bg-[#0c0c14] pt-6 pb-12 min-h-[calc(100vh-64px)]">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">CV Analysis</span> & Job Matching
          </h1>
          <p className="text-muted-foreground">
            Upload your CV to analyze your skills and find matching job opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="bg-[#1a1a2e] border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Upload Your CV
              </CardTitle>
              <CardDescription>
                We'll extract your skills and experience from your CV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted/30 rounded-lg p-8 text-center hover:border-primary/30 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-2">
                    Drag & drop your CV here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF files up to 5MB
                  </p>
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => document.getElementById("cv-upload")?.click()}
                  >
                    Select File
                  </Button>
                </div>
              </div>

              {file && (
                <div className="bg-primary/10 p-2 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="manual-skills">Or enter your skills manually (comma separated)</Label>
                <Textarea
                  id="manual-skills"
                  placeholder="e.g., JavaScript, React, Node.js, Python"
                  value={manualSkills}
                  onChange={(e) => setManualSkills(e.target.value)}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={handleAnalysis}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <span className="mr-2">Analyzing...</span>
                    <span>{progress}%</span>
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze & Find Jobs
                  </>
                )}
              </Button>

              {loading && (
                <Progress value={progress} className="h-1.5" />
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                <Card className="bg-[#1a1a2e] border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Skills Analysis
                    </CardTitle>
                    <CardDescription>
                      Extracted skills from your CV
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Recommended Job Titles</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.jobTitles.map((title, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-muted/20 text-muted-foreground rounded-full text-sm"
                          >
                            {title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1a2e] border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Matched Job Opportunities
                    </CardTitle>
                    <CardDescription>
                      Jobs that match your skills and experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.matchedJobs.map((job, index) => (
                        <div
                          key={index}
                          className="p-3 border border-muted/20 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                              <p className="text-xs text-muted-foreground mt-1">{job.location} • Source: {job.source}</p>
                            </div>
                            <div className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                              {job.matchPercentage}% Match
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <a 
                              href={job.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary text-sm hover:underline"
                            >
                              View Job →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-[#1a1a2e] border-primary/10 h-full flex flex-col justify-center items-center p-8">
                <div className="text-center space-y-4">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-medium">No Analysis Results Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload your CV or enter your skills manually, then click "Analyze & Find Jobs" 
                    to see matching job opportunities
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Card className="bg-[#1a1a2e] border-primary/10">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Note:</span> This is a demo version of the CV analysis feature. 
                In a production environment, your CV would be processed by our advanced AI model to extract skills and match them
                with real job opportunities from platforms like Wuzzuf, Bayt, and LinkedIn. The current demo provides
                simulated results to showcase the functionality.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CVAnalysis;
