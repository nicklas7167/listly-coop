import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Share2, LogOut } from "lucide-react";
import { CreateListDialog } from "@/components/CreateListDialog";
import { JoinListDialog } from "@/components/JoinListDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { ListsTable } from "@/components/ListsTable";
import { useQuery } from "@tanstack/react-query";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { translations } = useLanguage();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      console.log("Fetching lists...");
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching lists:", error);
        toast.error("Failed to fetch your lists. Please try again.");
        throw error;
      }

      console.log("Fetched lists:", data);
      return data || [];
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{translations.my_lists}</h1>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="flex-1 sm:flex-none items-center gap-2"
              size={isMobile ? "sm" : "default"}
            >
              <PlusCircle className="w-4 h-4" />
              {!isMobile && translations.create_list}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowJoinDialog(true)}
              className="flex-1 sm:flex-none items-center gap-2"
              size={isMobile ? "sm" : "default"}
            >
              <Share2 className="w-4 h-4" />
              {!isMobile && translations.join_list}
            </Button>
            <LanguageSelector />
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex-1 sm:flex-none items-center gap-2"
              size={isMobile ? "sm" : "default"}
            >
              <LogOut className="w-4 h-4" />
              {!isMobile && translations.sign_out}
            </Button>
          </div>
        </div>

        <ListsTable lists={lists || []} loading={isLoading} />
      </div>

      <CreateListDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      <JoinListDialog 
        open={showJoinDialog} 
        onOpenChange={setShowJoinDialog} 
      />
    </div>
  );
};

export default Dashboard;