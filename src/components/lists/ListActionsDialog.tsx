import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteListDialog } from "./DeleteListDialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const copyShareCode = (shareCode: string) => {
    navigator.clipboard.writeText(shareCode);
    toast({
      title: "Share code copied!",
      description: "Share this code with others to collaborate on this list.",
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {children}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
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
      </Dialog>

      <DeleteListDialog
        list={list}
        currentUserId={currentUserId}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}