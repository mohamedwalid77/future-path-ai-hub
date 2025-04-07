
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, Check, X, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import * as pdfjs from 'pdfjs-dist';

// Define the same JobMatch interface to ensure consistency
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
  description?: string;
}

interface CVUploadFormProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (skills: string[], jobMatches: JobMatch[], hasError?: boolean) => void;
  isPremium: boolean;
  simulateError?: boolean; // For testing error states
}

// Common tech skills categories with keywords
const skillsDatabase = {
  programming: [
    "javascript", "typescript", "python", "java", "c#", "c++", "ruby", "go", "php", "swift", "kotlin", 
    "perl", "scala", "rust", "dart", "objective-c", "shell", "powershell", "bash", "r", "matlab"
  ],
  web: [
    "html", "css", "sass", "less", "react", "angular", "vue", "svelte", "jquery", "bootstrap", 
    "tailwind", "material-ui", "webpack", "vite", "gulp", "grunt", "babel", "next.js", "gatsby", 
    "express", "node.js", "deno", "redux", "graphql", "rest api", "soap", "json", "xml"
  ],
  database: [
    "sql", "mysql", "postgresql", "mongodb", "firebase", "dynamodb", "oracle", "cassandra", 
    "redis", "elasticsearch", "neo4j", "mariadb", "sqlite", "supabase", "realm"
  ],
  devops: [
    "git", "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "jenkins", "circleci", 
    "travis", "github actions", "ansible", "chef", "puppet", "nginx", "apache", "linux", "ubuntu", 
    "centos", "windows server", "ci/cd"
  ],
  ai: [
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch", "keras", 
    "scikit-learn", "pandas", "numpy", "data analysis", "data science", "data mining", 
    "reinforcement learning", "neural networks", "llm", "openai", "hugging face"
  ],
  softSkills: [
    "communication", "teamwork", "leadership", "problem-solving", "critical thinking", 
    "time management", "project management", "agile", "scrum", "kanban", "jira", "confluence", 
    "presentation", "mentoring", "collaboration"
  ]
};

// Common job titles
const jobTitles = [
  "software engineer", "frontend developer", "backend developer", "full stack developer", 
  "mobile developer", "devops engineer", "data scientist", "machine learning engineer", 
  "data analyst", "ui designer", "ux designer", "product manager", "project manager", "qa engineer", 
  "web developer", "cloud engineer", "security engineer", "system administrator", "network engineer",
  "database administrator"
];

const CVUploadForm: React.FC<CVUploadFormProps> = ({ 
  onAnalysisStart, 
  onAnalysisComplete, 
  isPremium, 
  simulateError = false 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [forceError, setForceError] = useState(simulateError);
  
  // Initialize pdfjs worker
  React.useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

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

  // Function to extract text from PDF
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from the PDF');
    }
  };

  // Function to extract skills from CV text
  const extractSkillsFromText = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const extractedSkills = new Set<string>();
    
    // Extract all skills from the text based on the skills database
    Object.values(skillsDatabase).forEach(category => {
      category.forEach(skill => {
        // Look for the skill as a whole word with word boundaries
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(lowerText)) {
          extractedSkills.add(skill);
        }
      });
    });
    
    // Also look for job titles that might indicate skills
    jobTitles.forEach(title => {
      const regex = new RegExp(`\\b${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerText)) {
        extractedSkills.add(title);
      }
    });
    
    return Array.from(extractedSkills);
  };

  // Function to find jobs based on extracted skills
  const findJobsBasedOnSkills = (skills: string[]): JobMatch[] => {
    // These would normally be API calls to job boards
    // For simplicity, we'll simulate some job matches based on the skills
    
    const jobBoards = ["LinkedIn", "Wuzzuf", "Bayt", "Indeed"];
    const companies = [
      "TechCorp", "InnovateSoft", "DataSys", "WebFront", "AICore", 
      "CloudNative", "DevSecOps", "MobileTech", "QuantumCode", "CyberShield"
    ];
    const locations = [
      "Remote", "New York, NY", "San Francisco, CA", "London, UK", 
      "Berlin, Germany", "Toronto, Canada", "Dubai, UAE", "Cairo, Egypt"
    ];
    
    // Map of job titles and their related skills
    const jobSkillsMap: Record<string, string[]> = {
      "Frontend Developer": ["javascript", "typescript", "react", "angular", "vue", "html", "css"],
      "Backend Developer": ["python", "java", "c#", "node.js", "express", "php", "golang"],
      "Full Stack Developer": ["javascript", "typescript", "python", "react", "node.js", "mongodb", "sql"],
      "Data Scientist": ["python", "r", "machine learning", "data analysis", "tensorflow", "pandas", "numpy"],
      "DevOps Engineer": ["docker", "kubernetes", "aws", "azure", "terraform", "ci/cd", "linux"],
      "Mobile Developer": ["swift", "kotlin", "react native", "flutter", "android", "ios"],
      "UX/UI Designer": ["figma", "sketch", "adobe xd", "ui", "ux", "design"],
      "Product Manager": ["product management", "agile", "scrum", "user stories", "roadmap"],
      "Machine Learning Engineer": ["python", "machine learning", "deep learning", "tensorflow", "pytorch"]
    };
    
    const matches: JobMatch[] = [];
    
    // Generate job matches based on the user's skills
    Object.entries(jobSkillsMap).forEach(([jobTitle, requiredSkills]) => {
      // Calculate match score based on how many of the user's skills match the job requirements
      const matchingSkills = skills.filter(skill => 
        requiredSkills.some(reqSkill => skill.includes(reqSkill) || reqSkill.includes(skill))
      );
      
      if (matchingSkills.length > 0) {
        const matchScore = matchingSkills.length / requiredSkills.length;
        if (matchScore > 0.2) { // Only include if there's at least a 20% match
          const company = companies[Math.floor(Math.random() * companies.length)];
          const location = locations[Math.floor(Math.random() * locations.length)];
          const source = jobBoards[Math.floor(Math.random() * jobBoards.length)];
          
          matches.push({
            id: matches.length + 1,
            Title: jobTitle,
            Company: company,
            Location: location,
            Link: `https://example.com/job/${matches.length + 1}`,
            relevance_score: matchScore,
            Source: source,
            Search_Query: skills.slice(0, 3).join(", "),
            Tags: matchingSkills.join(", "),
            description: `This ${jobTitle} position requires skills in ${matchingSkills.slice(0, 3).join(", ")}. 
                         ${company} is looking for an experienced professional to join their team.`
          });
        }
      }
    });
    
    // Sort by match score
    matches.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
    
    // Limit results based on premium status
    return isPremium ? matches.slice(0, 5) : matches.slice(0, 2);
  };

  const analyzeCVWithModel = async (fileContent: string) => {
    setIsAnalyzing(true);
    
    try {
      // If we're forcing an error (for testing), throw an exception
      if (forceError) {
        throw new Error("Forced analysis error for testing");
      }
      
      // Extract skills from the CV text
      const extractedSkills = extractSkillsFromText(fileContent);
      
      // Sort by length (shorter skills first, to make display nicer)
      const sortedSkills = [...extractedSkills].sort((a, b) => a.length - b.length);
      
      // Limit skills based on premium status
      const limitedSkills = isPremium ? sortedSkills : sortedSkills.slice(0, 5);
      
      // Find jobs based on the extracted skills
      const jobMatches = findJobsBasedOnSkills(limitedSkills);
      
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        skills: limitedSkills,
        jobMatches: jobMatches
      };
    } catch (error) {
      console.error("Error in CV analysis:", error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
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
      
      // Extract text from PDF
      const pdfText = await extractTextFromPDF(file);
      console.log("Extracted text from PDF:", pdfText.substring(0, 200) + "...");
      
      try {
        // Analyze CV text to extract skills and find job matches
        const results = await analyzeCVWithModel(pdfText);
        
        // Call the completion handler with the results
        onAnalysisComplete(results.skills, results.jobMatches, false);
        
        toast({
          title: "CV Analysis Complete",
          description: `Found ${results.skills.length} skills and ${results.jobMatches.length} matching jobs.`,
        });
      } catch (error) {
        console.error("Error in CV analysis:", error);
        
        // Signal analysis failure
        onAnalysisComplete([], [], true);
        
        toast({
          title: "Analysis Failed",
          description: "There was a problem analyzing your CV. Please try again with a different file.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error analyzing CV:", error);
      
      // Signal analysis failure 
      onAnalysisComplete([], [], true);
      
      toast({
        title: "Analysis Failed",
        description: "There was a problem processing your CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to force an error state for testing
  const toggleForceError = () => {
    setForceError(prev => !prev);
    toast({
      title: forceError ? "Error simulation disabled" : "Error simulation enabled",
      description: forceError 
        ? "CV analysis will now attempt to complete normally" 
        : "Next CV upload will simulate an analysis failure",
    });
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
          
          {/* Hidden button to toggle error simulation - for testing only */}
          <div className="mt-4">
            <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/5 border border-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">
                Demo Mode: {forceError ? "Analysis will fail" : "Analysis will succeed"}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs ml-auto"
                onClick={toggleForceError}
              >
                {forceError ? "Disable Error" : "Simulate Error"}
              </Button>
            </div>
          </div>
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
