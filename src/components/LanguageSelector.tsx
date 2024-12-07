import { useState } from "react";
import { Globe, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
];

export function LanguageSelector() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const updateLanguage = async (languageCode: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.getUser();
      if (error) throw error;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ preferred_language: languageCode })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (updateError) throw updateError;

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
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <Globe className="h-4 w-4" />
        </Button>
      </DialogTrigger>
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