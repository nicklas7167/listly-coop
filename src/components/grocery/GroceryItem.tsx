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

interface GroceryItemProps {
  id: string;
  name: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
}

export function GroceryItem({ id, name, completed, onToggle }: GroceryItemProps) {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Item deleted");

      // Force reload the page to refresh the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error("Failed to delete item");
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
      <span className={`flex-1 ${completed ? "line-through text-gray-400" : ""}`}>
        {name}
      </span>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-auto touch-manipulation"
            aria-label="Delete item"
            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking delete
          >
            <Trash className="h-5 w-5 md:h-4 md:w-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}> {/* Prevent row click when dialog is open */}
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{name}" from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}