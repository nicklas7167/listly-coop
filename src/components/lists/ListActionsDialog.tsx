import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteListDialog } from "./DeleteListDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface ListActionsDialogProps {
  list: {
    id: string;
    name: string;
    share_code: string;
    owner_id: string;
  };
  currentUserId?: string;
  children: React.ReactNode;
}

export function ListActionsDialog({ list, currentUserId, children }: ListActionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { translations } = useLanguage();

  const copyShareCode = (shareCode: string) => {
    navigator.clipboard.writeText(shareCode);
    toast.success(translations.share_code_success);
  };

  const handleDeleteComplete = () => {
    setDeleteDialogOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {children}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>{translations.list_actions}</DialogTitle>
            <DialogDescription>
              {translations.manage_list_settings}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => copyShareCode(list.share_code)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              {translations.copy_share_code}
            </Button>
            {currentUserId === list.owner_id && (
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {translations.delete_list}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteListDialog
        list={list}
        currentUserId={currentUserId}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleteComplete={handleDeleteComplete}
      />
    </>
  );
}