import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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
  const queryClient = useQueryClient();

  const handleDeleteConfirm = async () => {
    if (confirmationText !== list.name) return;

    // Optimistically update the UI immediately
    const previousLists = queryClient.getQueryData(['lists']);
    queryClient.setQueryData(['lists'], (oldData: any) => {
      return oldData?.filter((item: any) => item.id !== list.id) || [];
    });

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
        // Close both dialogs
        onDeleteComplete?.();
        
        // Then invalidate queries to ensure consistency
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['lists'] }),
          queryClient.invalidateQueries({ queryKey: ['itemCounts'] })
        ]);
        
        toast.success("The list has been successfully deleted.");
      } else {
        // Revert the optimistic update if deletion fails
        queryClient.setQueryData(['lists'], previousLists);
        
        toast.error("You don't have permission to delete this list.");
      }
    } catch (error) {
      // Revert the optimistic update if there's an error
      queryClient.setQueryData(['lists'], previousLists);
      
      console.error('Error deleting list:', error);
      toast.error("Failed to delete the list. Please try again.");
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