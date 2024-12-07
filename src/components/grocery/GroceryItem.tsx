import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";

interface GroceryItemProps {
  id: string;
  name: string;
  completed: boolean;
  creatorId: string;
  store?: string;
  quantity?: string;
  onToggle: (id: string, completed: boolean) => Promise<void>;
}

export function GroceryItem({ 
  id, 
  name, 
  completed, 
  creatorId, 
  store, 
  quantity, 
  onToggle 
}: GroceryItemProps) {
  const { translations } = useLanguage();

  const { data: creatorProfile } = useQuery({
    queryKey: ['profile', creatorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', creatorId)
        .single();

      if (error) {
        console.error('Error fetching creator profile:', error);
        return null;
      }

      return data;
    },
  });

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(translations.item_deleted);

      // Force reload the page to refresh the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(translations.failed_delete);
    }
  };

  const handleToggle = async (e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    await onToggle(id, completed);
  };

  return (
    <div 
      onClick={handleToggle}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={handleToggle}
        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className={completed ? "line-through text-gray-400" : ""}>
            {name}
          </span>
          {quantity && (
            <span className="text-sm text-gray-500">
              · {quantity}
            </span>
          )}
          {store && (
            <span className="text-sm text-gray-500">
              · {store}
            </span>
          )}
          <span className="text-xs text-gray-400 font-medium">
            · {creatorProfile?.first_name || translations.anonymous_user}
          </span>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-auto touch-manipulation"
            aria-label="Delete item"
            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking delete
          >
            <Trash className="h-5 w-4 md:h-4 md:w-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}> {/* Prevent row click when dialog is open */}
          <AlertDialogHeader>
            <AlertDialogTitle>{translations.delete_confirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {translations.delete_item_confirm}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{translations.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{translations.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}