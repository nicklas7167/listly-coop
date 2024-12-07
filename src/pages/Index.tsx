import { Button } from "@/components/ui/button";
import { PlusCircle, Share2, Globe2, ArrowDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CreateListDialog } from "@/components/CreateListDialog";
import { JoinListDialog } from "@/components/JoinListDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CustomAuthForm } from "@/components/CustomAuthForm";

const Index = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [session, setSession] = useState(null);
  const authRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate("/dashboard");
        toast.success("Welcome back!");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const scrollToAuth = () => {
    authRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-primary/10">
      <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8 md:py-20">
        {/* Hero Section */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-4 md:space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient">
            Listify
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            The smart way to manage grocery shopping with family and friends.
            Never forget items or buy duplicates again!
          </p>

          {/* Language Support Banner */}
          <div className="inline-flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm border border-gray-100">
            <Globe2 className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm overflow-x-auto no-scrollbar">
              <span className="whitespace-nowrap">🇬🇧 English</span>
              <span className="text-gray-300">•</span>
              <span className="whitespace-nowrap">🇪🇸 Español</span>
              <span className="text-gray-300">•</span>
              <span className="whitespace-nowrap">🇩🇰 Dansk</span>
            </div>
          </div>

          {/* CTA Button - Updated for larger mobile size */}
          <Button 
            onClick={scrollToAuth}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-8 md:px-8 md:py-7 text-lg md:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group mt-6 md:mt-8 w-[80%] md:w-auto min-h-[4rem] md:min-h-0"
          >
            Get Started
            <ArrowDown className="ml-2 w-5 h-5 md:w-5 md:h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-6xl mt-8 md:mt-32 px-2 md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-4 md:p-8 rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-primary/10 rounded-lg p-2 md:p-3 w-fit group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mt-3 mb-1 md:mt-4 md:mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div 
        ref={authRef}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-secondary/20 to-primary/10 px-4 py-16"
      >
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Join Listify
            </h2>
            <CustomAuthForm />
          </div>
        </div>
      </div>

      <CreateListDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <JoinListDialog open={showJoinDialog} onOpenChange={setShowJoinDialog} />
    </div>
  );
};

const features = [
  {
    title: "Smart Shopping Lists",
    description: "Create multiple lists for different stores or occasions. Keep track of what you need and who added each item.",
    icon: PlusCircle,
  },
  {
    title: "Real-time Collaboration",
    description: "Share lists with family members or roommates. Everyone sees updates instantly when items are added or checked off.",
    icon: Share2,
  },
  {
    title: "Multi-language Support",
    description: "Use the app in your preferred language - English, Spanish, or Danish. Switch anytime with one click.",
    icon: Globe2,
  },
];

export default Index;
