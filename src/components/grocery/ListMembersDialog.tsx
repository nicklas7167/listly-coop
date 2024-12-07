import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "lucide-react";

interface ListMembersDialogProps {
  listId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Member {
  user_id: string;
  first_name: string | null;
}

export function ListMembersDialog({ listId, open, onOpenChange }: ListMembersDialogProps) {
  const { translations } = useLanguage();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['listMembers', listId],
    queryFn: async () => {
      // First, get the list members
      const { data: memberData, error: memberError } = await supabase
        .from('list_members')
        .select('user_id')
        .eq('list_id', listId);

      if (memberError) {
        console.error('Error fetching members:', memberError);
        throw memberError;
      }

      // Then, for each member, get their profile information
      const memberProfiles: Member[] = [];
      for (const member of memberData) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', member.user_id)
          .single();

        memberProfiles.push({
          user_id: member.user_id,
          first_name: profileData?.first_name || translations.anonymous_user
        });
      }

      return memberProfiles;
    },
    enabled: open && !!listId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{translations.list_members}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="text-center py-2">{translations.loading}</div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-secondary/10"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{member.first_name}</span>
                </div>
              ))}
              {members.length === 0 && (
                <div className="text-center text-muted-foreground py-2">
                  {translations.no_members}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}