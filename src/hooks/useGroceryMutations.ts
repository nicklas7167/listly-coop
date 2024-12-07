import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useGroceryMutations(listId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addItemMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!listId) throw new Error('No list ID provided');
      const { data, error } = await supabase
        .from('grocery_items')
        .insert([{ name, list_id: listId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryItems', listId] });
      toast({
        description: "Item added",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleItemMutation = useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from('grocery_items')
        .update({ completed })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryItems', listId] });
    },
    onError: () => {
      toast({
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      console.log('Deleting item:', itemId);
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error in delete mutation:', error);
        throw error;
      }
      return itemId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryItems', listId] });
      toast({
        description: "Item removed",
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast({
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    addItemMutation,
    toggleItemMutation,
    deleteItemMutation,
  };
}