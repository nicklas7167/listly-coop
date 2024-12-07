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

interface JoinListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinListDialog({ open, onOpenChange }: JoinListDialogProps) {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement join list logic
    navigate(`/list/${code}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join Existing List</DialogTitle>
            <DialogDescription>
              Enter the share code to join an existing grocery list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="col-span-3"
                placeholder="Enter share code"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!code.trim()}>
              Join List
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}