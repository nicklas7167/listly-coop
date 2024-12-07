import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface ListActionsDialogProps {
  list: {
    id: string;
    name: string;
    share_code: string;
    owner_id: string;
  };
  currentUserId?: string;
}

export function ListActionsDialog({ list, currentUserId }: ListActionsDialogProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const { toast } = useToast();

  const copyShareCode = (shareCode: string) => {
    navigator.clipboard.writeText(shareCode);
    toast({
      title: "Share code copied!",
      description: "Share this code with others to collaborate on this list.",
    });
  };

  const handleDeleteConfirm = async () => {
    if (confirmationText !== list.name) return;

    try {
      const { data, error } = await supabase.rpc(
        'delete_list_if_owner',
        { 
          p_list_id: list.id,
          p_user_id: currentUserId
        }
      );

      if (error) throw error;

      if (data) {
        toast({
          title: "List deleted",
          description: "The list has been successfully deleted.",
        });
        setDeleteDialogOpen(false);
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

    setConfirmationText("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm">
          Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>List Actions</DialogTitle>
          <DialogDescription>
            Manage your list settings and sharing options
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => copyShareCode(list.share_code)}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Copy Share Code
          </Button>
          {currentUserId === list.owner_id && (
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete List
            </Button>
          )}
        </div>
      </DialogContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the list
              "{list.name}" and all its items.
              <div className="mt-4">
                <p className="mb-2 text-sm text-muted-foreground">
                  Please type <span className="font-semibold">{list.name}</span> to confirm.
                </p>
                <Input
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type list name to confirm"
                  className="mt-1"
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
              setDeleteDialogOpen(false);
              setConfirmationText("");
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={confirmationText !== list.name}
            >
              Delete List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}