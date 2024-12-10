import { useState, useEffect, useRef } from "react";
import { CreateListDialog } from "@/components/CreateListDialog";
import { JoinListDialog } from "@/components/JoinListDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ViewType } from "@supabase/auth-ui-shared";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { AuthSection } from "@/components/landing/AuthSection";

const Index = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [session, setSession] = useState(null);
  const [authView, setAuthView] = useState<ViewType>('sign_up');
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
        <HeroSection onGetStarted={scrollToAuth} />
        <FeaturesGrid />
      </div>

      <AuthSection 
        authRef={authRef}
        view={authView}
        setView={setAuthView}
      />

      <CreateListDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <JoinListDialog open={showJoinDialog} onOpenChange={setShowJoinDialog} />
    </div>
  );
};

export default Index;