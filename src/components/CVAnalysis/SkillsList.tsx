
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface SkillsListProps {
  skills: string[];
}

const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
  // Group skills by category
  const skillCategories = {
    "Programming Languages": ["javascript", "typescript", "python", "java", "c++", "ruby", "php", "go", "rust"],
    "Web Development": ["react", "angular", "vue", "node.js", "express", "html", "css", "bootstrap", "tailwind"],
    "Data Science": ["data analysis", "machine learning", "deep learning", "python", "r", "statistics", "pandas", "numpy"],
    "DevOps": ["docker", "kubernetes", "aws", "azure", "ci/cd", "jenkins", "git", "linux", "bash"],
    "Design": ["ui", "ux", "figma", "sketch", "photoshop", "illustrator", "adobe xd"],
    "Other": []
  };

  // Assign each skill to its category
  const categorizedSkills: Record<string, string[]> = {
    "Programming Languages": [],
    "Web Development": [],
    "Data Science": [],
    "DevOps": [],
    "Design": [],
    "Other": []
  };

  skills.forEach(skill => {
    let assigned = false;
    for (const [category, categorySkills] of Object.entries(skillCategories)) {
      if (categorySkills.some(catSkill => skill.toLowerCase().includes(catSkill))) {
        categorizedSkills[category].push(skill);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      categorizedSkills["Other"].push(skill);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Extracted Skills</CardTitle>
        <CardDescription>
          Skills identified from your CV analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default SkillsList;
