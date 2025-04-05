
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Lock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type ModelFeature = {
  name: string;
  included: boolean;
};

type ModelCardProps = {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  price: string;
  features: ModelFeature[];
  onUse: () => void;
  onSubscribe: () => void;
};

const ModelCard = ({
  id,
  name,
  description,
  isPremium,
  price,
  features,
  onUse,
  onSubscribe,
}: ModelCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canUse = !isPremium || (user?.subscription === "premium");

  const handleUseModel = () => {
    // Call the provided onUse callback
    onUse();
    
    // If this is the premium model, navigate to the CV analysis page
    if (isPremium) {
      navigate("/cv-analysis");
    }
  };

  return (
    <Card className={`w-full overflow-hidden transition-all duration-300 hover:shadow-lg ${isPremium ? 'border-primary/50' : ''}`}>
      <div className={`h-2 w-full ${isPremium ? 'bg-gradient-to-r from-future-purple to-future-pink' : 'bg-muted'}`} />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              {name}
              {isPremium && (
                <Badge variant="default" className="bg-gradient-to-r from-future-purple to-future-pink">
                  Premium
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <div className={`p-3 rounded-full ${isPremium ? 'bg-primary/10' : 'bg-muted'}`}>
            <BrainCircuit className={`h-6 w-6 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline">
            {isPremium ? (
              <>
                <span className="text-3xl font-bold">{price}</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </>
            ) : (
              <span className="text-3xl font-bold">Free</span>
            )}
          </div>
          
          <ul className="space-y-2 mt-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                {feature.included ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className={feature.included ? '' : 'text-muted-foreground'}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        {canUse ? (
          <Button 
            className="w-full" 
            onClick={handleUseModel}
          >
            Use Model
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary/10" 
            onClick={onSubscribe}
          >
            Subscribe Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ModelCard;
