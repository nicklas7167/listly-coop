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
import { useToast } from "@/components/ui/use-toast";
import { checkListExists, joinList } from "@/utils/listOperations";
import { supabase } from "@/integrations/supabase/client";

interface JoinListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinListDialog({ open, onOpenChange }: JoinListDialogProps) {
  const [shareCode, setShareCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user's profile with first name
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
        toast({
          description: "You're already a member of this list.",
        });
      } else {
        toast({
          title: "Success!",
          description: "You've joined the list.",
        });
      }

      navigate(`/list/${list.id}`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error joining list:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join list. Please check the share code and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join Existing List</DialogTitle>
            <DialogDescription>
              Enter your name and the share code to join an existing grocery list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
                placeholder="Enter your first name"
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shareCode" className="text-right">
                Share Code
              </Label>
              <Input
                id="shareCode"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                className="col-span-3"
                placeholder="Enter share code"
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
              {loading ? "Joining..." : "Join List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}