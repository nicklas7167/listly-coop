import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface GroceryHeaderProps {
  shareCode: string;
}

export function GroceryHeader({ shareCode }: GroceryHeaderProps) {
  const { toast } = useToast();

  const copyShareCode = async () => {
    if (!shareCode) return;
    
    try {
      await navigator.clipboard.writeText(shareCode);
      toast({
        description: "Share code copied",
        duration: 2000,
      });
    } catch (err) {
      toast({
        description: "Failed to copy code",
        variant: "destructive",
      });
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