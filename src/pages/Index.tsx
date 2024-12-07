import { Button } from "@/components/ui/button";
import { PlusCircle, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
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
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/dashboard");
      }
    });

    // Listen for auth changes
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

  if (session) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-6">
          Grocery List
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-12">
          Create and share grocery lists with your family and friends. Simple,
          fast, and collaborative.
        </p>

        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
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
          />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-white shadow-lg animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <CreateListDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <JoinListDialog open={showJoinDialog} onOpenChange={setShowJoinDialog} />
    </div>
  );
};

const features = [
  {
    title: "Create Lists",
    description: "Create multiple grocery lists for different occasions or stores.",
    icon: PlusCircle,
  },
  {
    title: "Collaborate",
    description: "Share your lists with family and friends using a simple code.",
    icon: Share2,
  },
  {
    title: "Real-time Updates",
    description: "See changes instantly when items are added or checked off.",
    icon: Share2,
  },
];

export default Index;