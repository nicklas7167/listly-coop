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
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-primary/10">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-6 md:space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient">
            Listify
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            The smart way to manage grocery shopping with family and friends.
            Never forget items or buy duplicates again!
          </p>

          {/* Language Support Banner */}
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <Globe2 className="w-4 h-4 text-primary" />
            <div className="flex items-center gap-2 text-sm overflow-x-auto no-scrollbar">
              <span className="whitespace-nowrap">🇬🇧 English</span>
              <span className="text-gray-300">•</span>
              <span className="whitespace-nowrap">🇪🇸 Español</span>
              <span className="text-gray-300">•</span>
              <span className="whitespace-nowrap">🇩🇰 Dansk</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={scrollToAuth}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-7 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group mt-8"
          >
            Get Started
            <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-6xl mt-20 md:mt-32 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 md:p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-primary/10 rounded-xl p-3 w-fit group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
              Join Grocery List
            </h2>
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
                  button: { 
                    background: 'hsl(var(--primary))',
                    color: 'white',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                  },
                  anchor: { color: 'hsl(var(--primary))' },
                  message: { color: 'hsl(var(--destructive))' },
                  input: {
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                  },
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