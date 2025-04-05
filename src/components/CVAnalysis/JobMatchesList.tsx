
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building, MapPin, BarChart2 } from "lucide-react";

interface JobMatch {
  id: number;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  link: string;
  description?: string;
}

interface JobMatchesListProps {
  jobMatches: JobMatch[];
}

const JobMatchesList: React.FC<JobMatchesListProps> = ({ jobMatches }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Matching Jobs</CardTitle>
        <CardDescription>
          Jobs that match your skills and experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobMatches.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No matching jobs found. Try uploading a more detailed CV.
            </p>
          ) : (
            jobMatches.map(job => (
              <div key={job.id} className="border rounded-lg p-4 hover:border-primary/30 transition-colors">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      <BarChart2 className="h-3 w-3" />
                      <span>{job.matchScore}% Match</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  
                  {job.description && (
                    <p className="text-sm text-muted-foreground">
                      {job.description}
                    </p>
                  )}
                  
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => window.open(job.link, "_blank")}
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
