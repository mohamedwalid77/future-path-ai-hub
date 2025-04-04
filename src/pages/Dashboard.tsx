
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ModelCard from "@/components/AIModels/ModelCard";
import SubscriptionModal from "@/components/AIModels/SubscriptionModal";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const handleUseModel = (isPremium: boolean) => {
    if (isPremium && user?.subscription !== "premium") {
      setIsModalOpen(true);
    } else {
      toast({
        title: "Model activated",
        description: `You're now using the ${isPremium ? "Premium" : "Basic"} AI model.`,
      });
    }
  };

  const freeModelFeatures = [
    { name: "Basic career path suggestions", included: true },
    { name: "General skill assessments", included: true },
    { name: "Industry trends overview", included: true },
    { name: "Limited job recommendations", included: true },
    { name: "Personalized learning paths", included: false },
    { name: "Advanced skill gap analysis", included: false },
    { name: "Resume & interview optimization", included: false },
  ];

  const premiumModelFeatures = [
    { name: "Basic career path suggestions", included: true },
    { name: "General skill assessments", included: true },
    { name: "Industry trends overview", included: true },
    { name: "Unlimited job recommendations", included: true },
    { name: "Personalized learning paths", included: true },
    { name: "Advanced skill gap analysis", included: true },
    { name: "Resume & interview optimization", included: true },
  ];

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your AI Career Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your AI career model and start exploring personalized insights for your professional journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ModelCard
            id="free"
            name="Basic Model"
            description="Get started with AI-powered career guidance and skill assessments."
            isPremium={false}
            price="$0"
            features={freeModelFeatures}
            onUse={() => handleUseModel(false)}
            onSubscribe={() => setIsModalOpen(true)}
          />
          
          <ModelCard
            id="premium"
            name="Premium Model"
            description="Advanced career insights with personalized learning paths and job matching."
            isPremium={true}
            price="$5"
            features={premiumModelFeatures}
            onUse={() => handleUseModel(true)}
            onSubscribe={() => setIsModalOpen(true)}
          />
        </div>

        <div className="mt-16 bg-muted p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">Your Career Status</h2>
              <p className="text-muted-foreground mb-4">
                {user.subscription === "premium" 
                  ? "You have access to all premium features. Make the most of your subscription!" 
                  : "You're currently using the free plan. Upgrade to access premium features!"}
              </p>
              <div className="text-sm">
                <p><strong>Current Plan:</strong> {user.subscription === "premium" ? "Premium" : "Free"}</p>
                {user.subscription === "premium" && (
                  <p><strong>Next Billing Date:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              {user.subscription !== "premium" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
