import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Crown } from "lucide-react";

interface ListMembersDialogProps {
  listId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Member {
  user_id: string;
  first_name: string | null;
  is_owner?: boolean;
}

export function ListMembersDialog({ listId, open, onOpenChange }: ListMembersDialogProps) {
  const { translations } = useLanguage();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['listMembers', listId],
    queryFn: async () => {
      // First, get the list details to know who's the owner
      const { data: listData, error: listError } = await supabase
        .from('lists')
        .select('owner_id')
        .eq('id', listId)
        .single();

      if (listError) {
        console.error('Error fetching list:', listError);
        throw listError;
      }

      // Then, get the list members
      const { data: memberData, error: memberError } = await supabase
        .from('list_members')
        .select('user_id')
        .eq('list_id', listId);

      if (memberError) {
        console.error('Error fetching members:', memberError);
        throw memberError;
      }

      // Get all user IDs (owner + members)
      const userIds = [listData.owner_id, ...memberData.map(m => m.user_id)];
      const uniqueUserIds = [...new Set(userIds)]; // Remove duplicates in case owner is also in members

      // Then, for each user, get their profile information
      const memberProfiles: Member[] = [];
      for (const userId of uniqueUserIds) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', userId)
          .single();

        memberProfiles.push({
          user_id: userId,
          first_name: profileData?.first_name || translations.anonymous_user,
          is_owner: userId === listData.owner_id
        });
      }

      // Sort to put owner first
      return memberProfiles.sort((a, b) => {
        if (a.is_owner) return -1;
        if (b.is_owner) return 1;
        return 0;
      });
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
                  {member.is_owner ? (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
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