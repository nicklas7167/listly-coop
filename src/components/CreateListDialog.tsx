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
import { toast } from "sonner";
import { createList } from "@/utils/listOperations";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateListDialog({ open, onOpenChange }: CreateListDialogProps) {
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await createList(listName);
      
      toast.success(translations.list_created);
      navigate(`/list/${data.id}`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating list:", error);
      toast.error(translations.failed_create);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{translations.create_new_list}</DialogTitle>
            <DialogDescription>
              {translations.list_description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {translations.name}
              </Label>
              <Input
                id="name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="col-span-3"
                placeholder={translations.name}
                required
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!listName.trim() || loading}>
              {loading ? translations.creating : translations.create_list}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}