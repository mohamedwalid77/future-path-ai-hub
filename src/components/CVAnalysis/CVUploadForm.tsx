
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

interface CVUploadFormProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (skills: string[], jobMatches: any[]) => void;
  isPremium: boolean;
}

const CVUploadForm: React.FC<CVUploadFormProps> = ({ onAnalysisStart, onAnalysisComplete, isPremium }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    setFile(file);
    toast({
      title: "File selected",
      description: `${file.name} is ready for analysis.`,
    });
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const simulateUploadProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  };

  const analyzeCVWithModel = async () => {
    setIsAnalyzing(true);
    
    // Here we would typically send the CV to the Python backend
    // For now, we'll simulate the analysis with some mock data
    
    // This mock data is representative of what would come from the Python model
    const mockSkills = isPremium 
      ? [
          "python", "javascript", "react", "typescript", 
          "node.js", "data analysis", "git", "machine learning",
          "html", "css", "docker", "aws", "rest api"
        ]
      : [
          "javascript", "react", "typescript", 
          "node.js", "git"
        ];
    
    const mockJobMatches = isPremium 
      ? [
          {
            Title: "Frontend Developer",
            Company: "TechSolutions Inc.",
            Location: "Remote",
            relevance_score: 0.92,
            Link: "https://example.com/job1",
            description: "Looking for a skilled frontend developer with React experience.",
            Source: "Wuzzuf",
            Search_Query: "Frontend Developer",
            Tags: "React, JavaScript, TypeScript"
          },
          {
            Title: "Full Stack Developer",
            Company: "Innovate Tech",
            Location: "New York, NY",
            relevance_score: 0.87,
            Link: "https://example.com/job2",
            description: "Full stack role requiring JavaScript and Node.js expertise.",
            Source: "LinkedIn",
            Search_Query: "Full Stack Developer",
            Tags: "JavaScript, Node.js, React, MongoDB"
          },
          {
            Title: "Machine Learning Engineer",
            Company: "AI Solutions Ltd",
            Location: "San Francisco, CA",
            relevance_score: 0.78,
            Link: "https://example.com/job3",
            description: "ML position for candidates with Python and data analysis skills.",
            Source: "Bayt",
            Search_Query: "Data Scientist",
            Tags: "Python, Machine Learning, Data Analysis"
          },
          {
            Title: "Senior React Developer",
            Company: "WebTech Global",
            Location: "London, UK",
            relevance_score: 0.85,
            Link: "https://example.com/job4",
            Source: "Wuzzuf",
            Search_Query: "Frontend Developer",
            Tags: "React, Redux, TypeScript, Next.js"
          },
          {
            Title: "JavaScript Engineer",
            Company: "CodeMasters",
            Location: "Berlin, Germany",
            relevance_score: 0.81,
            Link: "https://example.com/job5",
            Source: "LinkedIn",
            Search_Query: "Frontend Developer",
            Tags: "JavaScript, ES6, Browser APIs"
          }
        ]
      : [
          {
            Title: "Frontend Developer",
            Company: "TechSolutions Inc.",
            Location: "Remote",
            relevance_score: 0.92,
            Link: "https://example.com/job1",
            Source: "Wuzzuf",
            Search_Query: "Frontend Developer"
          },
          {
            Title: "Full Stack Developer",
            Company: "Innovate Tech",
            Location: "New York, NY",
            relevance_score: 0.87,
            Link: "https://example.com/job2",
            Source: "LinkedIn",
            Search_Query: "Full Stack Developer"
          }
        ];
    
    // Simulate backend processing time
    await new Promise(resolve => setTimeout(resolve, isPremium ? 5000 : 3000));
    
    setIsAnalyzing(false);
    return { skills: mockSkills, jobMatches: mockJobMatches };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CV file to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    // Signal that analysis has started
    onAnalysisStart();
    
    try {
      // Simulate file upload
      await simulateUploadProgress();
      
      // Simulate CV analysis with Python model
      const results = await analyzeCVWithModel();
      
      // Call the completion handler with the results
      onAnalysisComplete(results.skills, results.jobMatches);
      
      toast({
        title: "CV Analysis Complete",
        description: `Found ${results.skills.length} skills and ${results.jobMatches.length} matching jobs.`,
      });
    } catch (error) {
      console.error("Error analyzing CV:", error);
      toast({
        title: "Analysis Failed",
        description: "There was a problem analyzing your CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Upload your CV</CardTitle>
        <CardDescription>
          {isPremium 
            ? "Our premium AI model will analyze your CV to extract skills and find matching jobs." 
            : "Upload your CV for basic analysis. Upgrade to premium for advanced features."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {!file && (
            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("cv-file")?.click()}
            >
              <input
                id="cv-file"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Drag and drop your CV here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse (PDF only, max 5MB)</p>
            </div>
          )}
          
          {file && (
            <div className="p-4 border rounded-lg bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isUploading || isAnalyzing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {isUploading && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Uploading...</p>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              {isAnalyzing && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Analyzing CV...</p>
                  <div className="flex items-center gap-2">
                    <div className="animate-spin">
                      <Upload className="h-4 w-4" />
                    </div>
                    <span className="text-sm">This may take a moment</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!file || isUploading || isAnalyzing}
          onClick={handleSubmit}
        >
          {isUploading ? "Uploading..." : isAnalyzing ? "Analyzing..." : "Analyze CV"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CVUploadForm;
