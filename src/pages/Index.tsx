import { Button } from "@/components/ui/button";
import { PlusCircle, Share2, Globe2, ArrowDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CreateListDialog } from "@/components/CreateListDialog";
import { JoinListDialog } from "@/components/JoinListDialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-16 animate-fade-in">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4 md:mb-6 px-4">
          Grocery List
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-600 text-center max-w-2xl mb-6 md:mb-8 px-4">
          The smart way to manage grocery shopping with family and friends.
          Never forget items or buy duplicates again!
        </p>

        <div className="w-full flex justify-center mb-8 md:mb-12 px-4">
          <div className="flex flex-wrap items-center gap-2 text-primary bg-white/50 p-3 rounded-lg shadow-sm">
            <Globe2 className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-medium">Available in:</span>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs md:text-sm bg-white px-2 py-1 rounded">🇬🇧 English</span>
              <span className="text-xs md:text-sm bg-white px-2 py-1 rounded">🇪🇸 Español</span>
              <span className="text-xs md:text-sm bg-white px-2 py-1 rounded">🇩🇰 Dansk</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={scrollToAuth}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all group"
        >
          Get Started
          <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </Button>

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-5xl px-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-4 md:p-6 rounded-xl bg-white shadow-lg animate-scale-in hover:shadow-xl transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="w-8 h-8 md:w-12 md:h-12 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div 
        ref={authRef}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-white px-4 py-16"
      >
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-4 md:p-8 mx-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary">Join Grocery List</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                  },
                },
              },
              style: {
                button: { background: 'hsl(var(--primary))', color: 'white' },
                anchor: { color: 'hsl(var(--primary))' },
                message: { color: 'hsl(var(--destructive))' },
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_input_placeholder: "Your email address",
                  password_input_placeholder: "Your password",
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Sign in",
                  loading_button_label: "Signing in ...",
                  social_provider_text: "Sign in with {{provider}}",
                  link_text: "Already have an account? Sign in",
                },
                sign_up: {
                  email_input_placeholder: "Your email address",
                  password_input_placeholder: "Your password",
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Sign up",
                  loading_button_label: "Signing up ...",
                  social_provider_text: "Sign up with {{provider}}",
                  link_text: "Don't have an account? Sign up",
                },
              },
            }}
            theme="default"
          />
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