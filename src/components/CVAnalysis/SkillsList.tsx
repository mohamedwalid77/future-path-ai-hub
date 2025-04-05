
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SkillsListProps {
  skills: string[];
  isLoading?: boolean;
  hasError?: boolean;
}

const SkillsList: React.FC<SkillsListProps> = ({ skills, isLoading = false, hasError = false }) => {
  // Group skills by category
  const skillCategories = {
    "Programming Languages": ["javascript", "typescript", "python", "java", "c#", "c++", "ruby", "go", "php", "swift", "kotlin"],
    "Web Development": ["react", "angular", "vue", "svelte", "jquery", "node.js", "express", "html", "css", "bootstrap", "tailwind"],
    "Data Science": ["data analysis", "machine learning", "deep learning", "python", "r", "statistics", "pandas", "numpy"],
    "DevOps": ["docker", "kubernetes", "aws", "azure", "ci/cd", "jenkins", "git", "linux", "bash"],
    "Mobile": ["android", "ios", "react native", "flutter", "swift", "kotlin", "mobile development"],
    "Design": ["ui", "ux", "figma", "sketch", "photoshop", "illustrator", "adobe xd"],
    "Database": ["sql", "mongodb", "mysql", "postgresql", "oracle", "dynamodb", "firebase"],
    "Other": []
  };

  // Assign each skill to its category
  const categorizedSkills: Record<string, string[]> = {
    "Programming Languages": [],
    "Web Development": [],
    "Data Science": [],
    "DevOps": [],
    "Mobile": [],
    "Design": [],
    "Database": [],
    "Other": []
  };

  skills.forEach(skill => {
    let assigned = false;
    for (const [category, categorySkills] of Object.entries(skillCategories)) {
      if (categorySkills.some(catSkill => 
        skill.toLowerCase().includes(catSkill) || 
        catSkill.includes(skill.toLowerCase())
      )) {
        categorizedSkills[category].push(skill);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      categorizedSkills["Other"].push(skill);
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Analyzing Skills</CardTitle>
          <CardDescription>
            Extracting skills from your CV...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 bg-primary/20 rounded w-3/4 mb-2.5"></div>
              <div className="h-4 bg-primary/20 rounded w-1/2 mb-2.5"></div>
              <div className="h-4 bg-primary/20 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Analysis Failed
          </CardTitle>
          <CardDescription>
            We couldn't analyze your CV successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              There was an error processing your CV. This could be due to the format or content of your PDF file.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Possible reasons for failure:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The PDF may contain security restrictions</li>
              <li>The file may be corrupted or have an unusual format</li>
              <li>The text in the PDF might not be properly extractable</li>
              <li>The CV may not contain enough recognizable text</li>
            </ul>
            <p className="mt-4">Please try uploading a different CV file or ensure your PDF is not password-protected.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Extracted Skills</CardTitle>
        <CardDescription>
          {skills.length > 0 
            ? "Skills identified from your CV analysis" 
            : "No skills were identified. Please upload a more detailed CV."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No skills found. Try uploading a CV with more detailed technical information.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(categorizedSkills).map(([category, categorySkills]) => 
              categorySkills.length > 0 && (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="flex items-center gap-1 bg-primary/5 text-primary border-primary/20"
                      >
                        <Check className="h-3 w-3" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsList;
