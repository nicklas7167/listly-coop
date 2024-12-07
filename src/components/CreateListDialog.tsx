import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateListDialog({ open, onOpenChange }: CreateListDialogProps) {
  const [listName, setListName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement list creation logic
    navigate(`/list/${Math.random().toString(36).substr(2, 9)}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
            <DialogDescription>
              Give your grocery list a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="col-span-3"
                placeholder="Weekly Groceries"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!listName.trim()}>
              Create List
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}