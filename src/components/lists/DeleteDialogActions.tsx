import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Translations } from "@/translations/types";

interface DeleteDialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isConfirmDisabled: boolean;
  translations: Translations;
}

export function DeleteDialogActions({ 
  onCancel, 
  onConfirm, 
  isConfirmDisabled,
  translations 
}: DeleteDialogActionsProps) {
  return (
    <DialogFooter>
      <Button variant="ghost" onClick={onCancel}>
        {translations.cancel}
      </Button>
      <Button
        variant="destructive"
        onClick={onConfirm}
        disabled={isConfirmDisabled}
      >
        {translations.delete_list}
      </Button>
    </DialogFooter>
  );
}