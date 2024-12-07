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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { translations } = useLanguage();

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
        onDeleteComplete?.();
        
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['lists'] }),
          queryClient.invalidateQueries({ queryKey: ['itemCounts'] })
        ]);
        
        toast.success(translations.delete_list_success);
      } else {
        queryClient.setQueryData(['lists'], previousLists);
        toast.error(translations.delete_list_error);
      }
    } catch (error) {
      queryClient.setQueryData(['lists'], previousLists);
      console.error('Error deleting list:', error);
      toast.error(translations.delete_list_error);
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
          <DialogTitle>{translations.delete_list_confirm}</DialogTitle>
          <DialogDescription>
            {translations.delete_list_warning}
            <DeleteConfirmationInput
              listName={list.name}
              value={confirmationText}
              onChange={setConfirmationText}
              translations={translations}
            />
          </DialogDescription>
        </DialogHeader>
        <DeleteDialogActions
          onCancel={handleCancel}
          onConfirm={handleDeleteConfirm}
          isConfirmDisabled={confirmationText !== list.name}
          translations={translations}
        />
      </DialogContent>
    </Dialog>
  );
}