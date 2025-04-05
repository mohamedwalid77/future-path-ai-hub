
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { EmailVerificationBanner } from "@/components/auth/AuthForms";
import CVUploadForm from "@/components/CVAnalysis/CVUploadForm";
import SkillsList from "@/components/CVAnalysis/SkillsList";
import JobMatchesList from "@/components/CVAnalysis/JobMatchesList";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Award, FileText } from "lucide-react";

// Update the interface to match the one in JobMatchesList.tsx
interface JobMatch {
  id?: number;
  Title: string;
  Company: string;
  Location: string;
  Link: string;
  relevance_score?: number;
  Source?: string;
  Search_Query?: string;
  Tags?: string;
  // Compatibility with old structure
  title?: string;
  company?: string;
  location?: string;
  matchScore?: number;
  link?: string;
  description?: string;
}

const CVAnalysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = (skills: string[], matches: JobMatch[]) => {
    setExtractedSkills(skills);
    setJobMatches(matches);
    setHasAnalyzed(true);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setExtractedSkills([]);
    setJobMatches([]);
    setHasAnalyzed(false);
  };

  const isPremiumUser = user?.subscription === "premium";

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <>
      <EmailVerificationBanner />
      
      <div className="bg-[#0c0c14] pt-6 pb-12 min-h-[calc(100vh-64px)]">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              CV Analysis
            </h1>
            <p className="text-muted-foreground">
              {isPremiumUser 
                ? "Upload your CV for AI-powered analysis and job matching"
                : "Basic CV analysis is available. Upgrade to premium for full features."}
            </p>
          </div>
          
          {!hasAnalyzed ? (
            <div className="max-w-3xl mx-auto">
              <CVUploadForm 
                onAnalysisStart={handleAnalysisStart} 
                onAnalysisComplete={handleAnalysisComplete} 
                isPremium={isPremiumUser}
              />
              
              {!isPremiumUser && (
                <Card className="mt-8 border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Premium Features
                    </CardTitle>
                    <CardDescription>
                      Upgrade to access advanced CV analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Advanced skill extraction with categorization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Job matching from multiple job boards (Wuzzuf, LinkedIn, Bayt)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Career path recommendations based on your profile</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Personalized skill improvement suggestions</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => navigate("/dashboard?tab=models")}
                    >
                      Upgrade to Premium
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-6">
                <Button variant="outline" onClick={handleReset}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Another CV
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <SkillsList skills={extractedSkills} isLoading={isAnalyzing} />
                <JobMatchesList jobMatches={jobMatches} isLoading={isAnalyzing} />
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Want more personalized job matches?{" "}
                  {isPremiumUser ? (
                    "Try refining your CV with more details about your experience and skills."
                  ) : (
                    <Button 
                      variant="link" 
                      onClick={() => navigate("/dashboard?tab=models")}
                      className="px-0 text-primary"
                    >
                      Upgrade to Premium
                    </Button>
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CVAnalysis;
