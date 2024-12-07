import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DeleteListDialogProps {
  list: {
    id: string;
    name: string;
  };
  currentUserId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteListDialog({ list, currentUserId, open, onOpenChange }: DeleteListDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const { toast } = useToast();

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
        onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
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
            onOpenChange(false);
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
  );
}