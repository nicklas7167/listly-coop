import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ViewType } from "@supabase/auth-ui-shared";

interface AuthSectionProps {
  authRef: React.RefObject<HTMLDivElement>;
  view: ViewType;
  setView: (view: ViewType) => void;
}

export const AuthSection = ({ authRef, view, setView }: AuthSectionProps) => {
  return (
    <div 
      ref={authRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-secondary/20 to-primary/10 px-4 py-16"
    >
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {view === 'sign_in' ? 'Welcome Back' : 'Join Listify'}
          </h2>
          <Auth
            supabaseClient={supabase}
            view={view}
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
                  password_input_placeholder: "Choose a password",
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Sign up",
                  loading_button_label: "Signing up ...",
                  social_provider_text: "Sign up with {{provider}}",
                  link_text: "Don't have an account? Sign up",
                  confirmation_text: "Check your email for the confirmation link",
                },
              },
            }}
            theme="default"
          />
        </div>
      </div>
    </div>
  );
};