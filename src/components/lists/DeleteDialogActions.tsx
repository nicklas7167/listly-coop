import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface DeleteDialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isConfirmDisabled: boolean;
}

export function DeleteDialogActions({ onCancel, onConfirm, isConfirmDisabled }: DeleteDialogActionsProps) {
  return (
    <DialogFooter>
      <Button variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={onConfirm}
        disabled={isConfirmDisabled}
      >
        Delete List
      </Button>
    </DialogFooter>
  );
}