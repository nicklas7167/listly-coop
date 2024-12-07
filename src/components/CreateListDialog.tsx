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
import { supabase } from "@/integrations/supabase/client";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateListDialog({ open, onOpenChange }: CreateListDialogProps) {
  const [listName, setListName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update the user's profile with their first name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ first_name: firstName.trim() })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) {
        throw new Error("Failed to update profile");
      }

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
            <div className="grid gap-2">
              <Label htmlFor="firstName">
                {translations.first_name}
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={translations.enter_first_name}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">
                {translations.name}
              </Label>
              <Input
                id="name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="e.g., Weekly Groceries, Family Shopping"
                required
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!listName.trim() || !firstName.trim() || loading}
            >
              {loading ? translations.creating : translations.create_list}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}