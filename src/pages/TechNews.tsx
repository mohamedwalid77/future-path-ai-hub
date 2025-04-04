
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample news data (normally would be fetched from an API)
const newsItems = [
  {
    id: 1,
    title: "AI Revolutionizes Career Planning with New Predictive Models",
    content: "Researchers have developed a new generation of AI models that can predict career trajectories with unprecedented accuracy, taking into account industry trends, personal skills, and market demands.",
    publishedAt: "2025-04-01",
    readTime: "5 min read",
    category: "Research",
    link: "#",
  },
  {
    id: 2,
    title: "Tech Giants Invest Billions in AI Education Platforms",
    content: "Major technology companies have announced significant investments in AI-powered education platforms aimed at reskilling workers for the jobs of tomorrow.",
    publishedAt: "2025-03-28",
    readTime: "4 min read",
    category: "Industry",
    link: "#",
  },
  {
    id: 3,
    title: "Machine Learning Engineers Top the List of Most In-Demand Jobs",
    content: "According to recent industry reports, machine learning engineers and AI specialists continue to be the most sought-after professionals, with demand outpacing supply by a significant margin.",
    publishedAt: "2025-03-25",
    readTime: "6 min read",
    category: "Jobs",
    link: "#",
  },
  {
    id: 4,
    title: "New AI Ethics Guidelines Released for Career Development Tools",
    content: "A coalition of tech companies and academic institutions has published comprehensive guidelines for the ethical development and deployment of AI-powered career guidance systems.",
    publishedAt: "2025-03-22",
    readTime: "7 min read",
    category: "Ethics",
    link: "#",
  },
  {
    id: 5,
    title: "Personalized Learning Paths Show 40% Improvement in Skill Acquisition",
    content: "A recent study demonstrates that AI-generated personalized learning paths lead to significantly faster skill acquisition compared to traditional one-size-fits-all approaches.",
    publishedAt: "2025-03-20",
    readTime: "5 min read",
    category: "Education",
    link: "#",
  },
  {
    id: 6,
    title: "AI Startups Focused on Career Development Raise Record Funding",
    content: "Venture capital investments in AI startups specializing in career development and professional growth have reached an all-time high in the first quarter of 2025.",
    publishedAt: "2025-03-18",
    readTime: "4 min read",
    category: "Funding",
    link: "#",
  },
];

const TechNews = () => {
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Latest AI & Tech News</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the latest developments in AI and technology that are shaping the future of careers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {newsItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all">
              <CardHeader className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <Badge variant="outline" className="shrink-0">{item.category}</Badge>
                </div>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {new Date(item.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {item.readTime}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground">{item.content}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <a href={item.link} className="flex items-center gap-2">
                    Read Full Article
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechNews;
