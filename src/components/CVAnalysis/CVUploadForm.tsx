
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

interface CVUploadFormProps {
  onAnalysisComplete: (skills: string[], jobMatches: any[]) => void;
}

const CVUploadForm: React.FC<CVUploadFormProps> = ({ onAnalysisComplete }) => {
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
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate CV analysis
    setTimeout(() => {
      // Mock data that would come from the Python model
      const extractedSkills = [
        "python", "javascript", "react", "typescript", 
        "node.js", "data analysis", "git", "machine learning"
      ];
      
      const mockJobMatches = [
        {
          id: 1,
          title: "Frontend Developer",
          company: "TechSolutions Inc.",
          location: "Remote",
          matchScore: 92,
          link: "https://example.com/job1",
          description: "Looking for a skilled frontend developer with React experience."
        },
        {
          id: 2,
          title: "Full Stack Developer",
          company: "Innovate Tech",
          location: "New York, NY",
          matchScore: 87,
          link: "https://example.com/job2",
          description: "Full stack role requiring JavaScript and Node.js expertise."
        },
        {
          id: 3,
          title: "Machine Learning Engineer",
          company: "AI Solutions Ltd",
          location: "San Francisco, CA",
          matchScore: 78,
          link: "https://example.com/job3",
          description: "ML position for candidates with Python and data analysis skills."
        },
      ];
      
      setIsAnalyzing(false);
      onAnalysisComplete(extractedSkills, mockJobMatches);
      
      toast({
        title: "CV Analysis Complete",
        description: `Found ${extractedSkills.length} skills and ${mockJobMatches.length} matching jobs.`,
      });
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CV file to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    simulateUploadProgress();
    
    // After "uploading" is complete, start analysis
    setTimeout(() => {
      simulateAnalysis();
    }, 3000);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Upload your CV</CardTitle>
        <CardDescription>
          {user?.subscription === "premium" 
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
