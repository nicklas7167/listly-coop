import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
];

export function LanguageSelector() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find(l => l.code === language);

  const updateLanguage = async (languageCode: string) => {
    setIsLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (!user) {
        throw new Error("No user found");
      }

      // First try to update existing profile
      const { error: updateError, data } = await supabase
        .from("profiles")
        .update({ preferred_language: languageCode })
        .eq("id", user.id)
        .select();

      // If no rows were affected (profile doesn't exist), create one
      if (updateError || !data || data.length === 0) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ 
            id: user.id, 
            preferred_language: languageCode,
            first_name: user.user_metadata?.first_name || 'User'
          }]);

        if (insertError) throw insertError;
      }

      setLanguage(languageCode as "en" | "es" | "da");
      toast.success(`Language updated to ${languages.find(l => l.code === languageCode)?.name}`);
      setOpen(false);
    } catch (error) {
      console.error("Error updating language:", error);
      toast.error("Failed to update language preference");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              disabled={isLoading}
              className="text-xl hover:bg-secondary/50 transition-colors"
            >
              {currentLanguage?.flag}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change language</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => updateLanguage(language.code)}
              disabled={isLoading}
            >
              <span className="text-xl">{language.flag}</span>
              {language.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}