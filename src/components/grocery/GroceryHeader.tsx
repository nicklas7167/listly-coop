import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface GroceryHeaderProps {
  shareCode: string;
}

export function GroceryHeader({ shareCode }: GroceryHeaderProps) {
  const { translations } = useLanguage();
  
  const copyShareCode = async () => {
    if (!shareCode) return;
    
    try {
      await navigator.clipboard.writeText(shareCode);
      toast.success(translations.share_code_copied);
    } catch (err) {
      toast.error(translations.failed_copy);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <Link to="/dashboard">
        <Button variant="ghost" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          {translations.back}
        </Button>
      </Link>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={copyShareCode}
      >
        <Copy className="w-4 h-4" />
        {translations.share_code}
      </Button>
    </div>
  );
}