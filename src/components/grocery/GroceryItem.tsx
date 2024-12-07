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
import { toast } from "@/hooks/use-toast";

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

      toast({
        description: "Item deleted",
        duration: 2000,
      });

      // Force reload the page to refresh the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
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
            className="text-gray-400 hover:text-red-500 transition-colors ml-auto"
            aria-label="Delete item"
            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking delete
          >
            <Trash className="h-4 w-4" />
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