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
import { checkListExists, joinList } from "@/utils/listOperations";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface JoinListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinListDialog({ open, onOpenChange }: JoinListDialogProps) {
  const [shareCode, setShareCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ first_name: firstName.trim() })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) {
        throw new Error("Failed to update profile");
      }

      console.log("Starting join process with share code:", shareCode);
      const list = await checkListExists(shareCode.trim());
      console.log("Found list:", list);
      
      const { alreadyMember } = await joinList(shareCode.trim());
      console.log("Join result - already member:", alreadyMember);

      if (alreadyMember) {
        toast(translations.already_member);
      } else {
        toast.success(translations.joined_success);
      }

      navigate(`/list/${list.id}`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error joining list:", error);
      toast.error(translations.failed_join);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{translations.join_existing}</DialogTitle>
            <DialogDescription>
              {translations.join_description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                {translations.first_name}
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
                placeholder={translations.enter_first_name}
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shareCode" className="text-right">
                {translations.share_code}
              </Label>
              <Input
                id="shareCode"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                className="col-span-3"
                placeholder={translations.enter_share_code}
                required
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!shareCode.trim() || !firstName.trim() || loading}
            >
              {loading ? translations.joining : translations.join_list}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}