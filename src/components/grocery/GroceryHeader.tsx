import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface GroceryHeaderProps {
  shareCode: string;
}

export function GroceryHeader({ shareCode }: GroceryHeaderProps) {
  const copyShareCode = async () => {
    if (!shareCode) return;
    
    try {
      await navigator.clipboard.writeText(shareCode);
      toast.success("Share code copied");
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <Link to="/dashboard">
        <Button variant="ghost" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </Link>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={copyShareCode}
      >
        <Copy className="w-4 h-4" />
        Share Code
      </Button>
    </div>
  );
}