import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmationInput } from "./DeleteConfirmationInput";
import { DeleteDialogActions } from "./DeleteDialogActions";

interface DeleteListDialogProps {
  list: {
    id: string;
    name: string;
  };
  currentUserId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteComplete?: () => void;
}

export function DeleteListDialog({ 
  list, 
  currentUserId, 
  open, 
  onOpenChange,
  onDeleteComplete 
}: DeleteListDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        // Update the cache immediately to remove the deleted list
        queryClient.setQueryData(['lists'], (oldData: any) => {
          return oldData?.filter((item: any) => item.id !== list.id) || [];
        });

        // Close both dialogs
        onDeleteComplete?.();
        
        // Then invalidate queries to ensure consistency
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['lists'] }),
          queryClient.invalidateQueries({ queryKey: ['itemCounts'] })
        ]);
        
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
  };

  const handleCancel = () => {
    onOpenChange(false);
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
            <DeleteConfirmationInput
              listName={list.name}
              value={confirmationText}
              onChange={setConfirmationText}
            />
          </DialogDescription>
        </DialogHeader>
        <DeleteDialogActions
          onCancel={handleCancel}
          onConfirm={handleDeleteConfirm}
          isConfirmDisabled={confirmationText !== list.name}
        />
      </DialogContent>
    </Dialog>
  );
}