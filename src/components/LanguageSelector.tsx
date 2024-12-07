import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "da", name: "Dansk" },
];

export function LanguageSelector() {
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
      console.error("Error updating language:", error);
      toast.error("Failed to update language preference");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => updateLanguage(language.code)}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}