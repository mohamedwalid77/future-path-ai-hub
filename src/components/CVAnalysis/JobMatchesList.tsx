
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building, MapPin, BarChart2, Tag } from "lucide-react";

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
  matchScore?: number; // For backward compatibility
  title?: string; // For backward compatibility
  company?: string; // For backward compatibility
  location?: string; // For backward compatibility
  link?: string; // For backward compatibility
  description?: string;
}

interface JobMatchesListProps {
  jobMatches: JobMatch[];
  isLoading?: boolean;
}

const JobMatchesList: React.FC<JobMatchesListProps> = ({ jobMatches, isLoading = false }) => {
  // Normalize job data to handle both formats
  const normalizedJobs = jobMatches.map(job => {
    return {
      id: job.id || Math.random(),
      Title: job.Title || job.title || "",
      Company: job.Company || job.company || "",
      Location: job.Location || job.location || "",
      Link: job.Link || job.link || "",
      matchScore: (job.relevance_score ? job.relevance_score * 100 : job.matchScore) || 0,
      Source: job.Source || "",
      Tags: job.Tags || "",
      description: job.description || ""
    };
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Finding Job Matches</CardTitle>
          <CardDescription>
            Searching for jobs matching your skills...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse flex flex-col items-center w-full space-y-4">
              <div className="h-20 bg-primary/10 rounded w-full mb-2.5"></div>
              <div className="h-20 bg-primary/10 rounded w-full mb-2.5"></div>
              <div className="h-20 bg-primary/10 rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Matching Jobs</CardTitle>
        <CardDescription>
          {normalizedJobs.length > 0 
            ? "Jobs that match your skills and experience" 
            : "No matching jobs found. Try uploading a more detailed CV."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {normalizedJobs.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No matching jobs found. Try uploading a more detailed CV or adding more technical skills.
            </p>
          ) : (
            normalizedJobs.map(job => (
              <div key={job.id} className="border rounded-lg p-4 hover:border-primary/30 transition-colors">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{job.Title}</h3>
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      <BarChart2 className="h-3 w-3" />
                      <span>{job.matchScore.toFixed(1)}% Match</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{job.Company}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.Location}</span>
                    </div>
                  </div>

                  {job.Source && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Source:</span> {job.Source}
                    </div>
                  )}
                  
                  {job.Tags && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Tag className="h-3 w-3" />
                      <span>{job.Tags}</span>
                    </div>
                  )}
                  
                  {job.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {job.description}
                    </p>
                  )}
                  
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => window.open(job.Link, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Job
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobMatchesList;
