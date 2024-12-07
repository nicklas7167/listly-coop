import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Share2, LogOut, Copy } from "lucide-react";
import { CreateListDialog } from "@/components/CreateListDialog";
import { JoinListDialog } from "@/components/JoinListDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [lists, setLists] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      console.log("Fetching lists...");
      const { data: lists, error } = await supabase
        .from("lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching lists:", error);
        throw error;
      }

      console.log("Fetched lists:", lists);
      setLists(lists || []);
    } catch (error) {
      console.error("Error in fetchLists:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your lists. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const copyShareCode = (shareCode: string) => {
    navigator.clipboard.writeText(shareCode);
    toast({
      title: "Share code copied!",
      description: "Share this code with others to collaborate on this list.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Lists</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create List
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowJoinDialog(true)}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Join List
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading your lists...</div>
        ) : lists.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">No Lists Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first list or join an existing one to get started.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowCreateDialog(true)}>
                Create List
              </Button>
              <Button variant="outline" onClick={() => setShowJoinDialog(true)}>
                Join List
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Share Code</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell className="font-medium">{list.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => copyShareCode(list.share_code)}
                      >
                        <span className="font-mono">{list.share_code}</span>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      {new Date(list.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => navigate(`/list/${list.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CreateListDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      <JoinListDialog open={showJoinDialog} onOpenChange={setShowJoinDialog} />
    </div>
  );
};

export default Dashboard;