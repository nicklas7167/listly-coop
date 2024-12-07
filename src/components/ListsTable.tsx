import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Share2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface List {
  id: string;
  name: string;
  share_code: string;
  owner_id: string;
}

interface ListsTableProps {
  lists: List[];
  loading: boolean;
}

export function ListsTable({ lists, loading }: ListsTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<List | null>(null);
  const [confirmationText, setConfirmationText] = useState("");

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch item counts for each list
  const { data: itemCounts } = useQuery({
    queryKey: ['itemCounts'],
    queryFn: async () => {
      console.log("Fetching item counts...");
      const counts: Record<string, number> = {};
      
      for (const list of lists) {
        const { count, error } = await supabase
          .from('grocery_items')
          .select('*', { count: 'exact', head: true })
          .eq('list_id', list.id);
          
        if (error) {
          console.error('Error fetching count for list:', list.id, error);
          counts[list.id] = 0;
        } else {
          counts[list.id] = count || 0;
        }
      }
      
      console.log("Item counts:", counts);
      return counts;
    },
    enabled: lists.length > 0,
  });

  const copyShareCode = (shareCode: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(shareCode);
    toast({
      title: "Share code copied!",
      description: "Share this code with others to collaborate on this list.",
    });
  };

  const handleDeleteClick = (list: List, event: React.MouseEvent) => {
    event.stopPropagation();
    setListToDelete(list);
    setConfirmationText("");
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!listToDelete || confirmationText !== listToDelete.name) {
      return;
    }

    try {
      const { data, error } = await supabase.rpc(
        'delete_list_if_owner',
        { 
          p_list_id: listToDelete.id,
          p_user_id: currentUser?.id
        }
      );

      if (error) throw error;

      if (data) {
        toast({
          title: "List deleted",
          description: "The list has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "You don't have permission to delete this list.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: "Error",
        description: "Failed to delete the list. Please try again.",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setListToDelete(null);
    setConfirmationText("");
  };

  const handleRowClick = (listId: string) => {
    navigate(`/list/${listId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading your lists...</div>;
  }

  if (lists.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">No Lists Yet</h3>
        <p className="text-gray-600 mb-4">
          Create your first list or join an existing one to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lists.map((list) => (
              <TableRow 
                key={list.id} 
                onClick={() => handleRowClick(list.id)}
                className="cursor-pointer hover:bg-secondary/10 transition-colors"
              >
                <TableCell className="font-medium">{list.name}</TableCell>
                <TableCell className="text-right">
                  {itemCounts?.[list.id] || 0}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-48" 
                      align="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={(e) => copyShareCode(list.share_code, e)}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>Copy Share Code</span>
                        </Button>
                        {currentUser?.id === list.owner_id && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-destructive hover:text-destructive"
                            onClick={(e) => handleDeleteClick(list, e)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete List</span>
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the list
              "{listToDelete?.name}" and all its items.
              <div className="mt-4">
                <p className="mb-2 text-sm text-muted-foreground">
                  Please type <span className="font-semibold">{listToDelete?.name}</span> to confirm.
                </p>
                <Input
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type list name to confirm"
                  className="mt-1"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmationText("")}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={confirmationText !== listToDelete?.name}
            >
              Delete List
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}