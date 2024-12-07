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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface JoinListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinListDialog({ open, onOpenChange }: JoinListDialogProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // First check if the list exists
      const { data: list, error: listError } = await supabase
        .from("lists")
        .select("*")
        .eq("id", code)
        .single();

      if (listError) {
        throw new Error("List not found");
      }

      // Join the list
      const { error: joinError } = await supabase
        .from("list_members")
        .insert({
          list_id: code,
          user_id: user.id
        });

      if (joinError) {
        if (joinError.code === "23505") {
          // Unique violation - already a member
          toast({
            description: "You're already a member of this list.",
          });
          navigate(`/list/${code}`);
          onOpenChange(false);
          return;
        }
        throw joinError;
      }

      toast({
        title: "Success!",
        description: "You've joined the list.",
      });

      navigate(`/list/${code}`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error joining list:", error);
      toast({
        title: "Error",
        description: "Failed to join list. Please check the code and try again.",
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
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!code.trim() || loading}>
              {loading ? "Joining..." : "Join List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}