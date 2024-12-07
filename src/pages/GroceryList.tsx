import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroceryHeader } from "@/components/grocery/GroceryHeader";
import { AddItemDialog } from "@/components/grocery/AddItemDialog";
import { GroceryItem } from "@/components/grocery/GroceryItem";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users } from "lucide-react";
import { ListMembersDialog } from "@/components/grocery/ListMembersDialog";
import { Button } from "@/components/ui/button";

interface GroceryItem {
  id: string;
  name: string;
  completed: boolean;
  list_id: string;
}

const GroceryList = () => {
  const { id } = useParams();
  const [shareCode, setShareCode] = useState<string>("");
  const queryClient = useQueryClient();
  const { translations } = useLanguage();
  const [showMembers, setShowMembers] = useState(false);

  // Fetch list details
  const { data: listDetails } = useQuery({
    queryKey: ['list', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("lists")
        .select("name, share_code")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching list:", error);
        return null;
      }

      if (data) {
        setShareCode(data.share_code);
      }
      return data;
    },
  });

  // Fetch items query
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['groceryItems', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('grocery_items')
        .select('*')
        .eq('list_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching items:', error);
        throw error;
      }
      return data as GroceryItem[];
    },
  });

  // Toggle item mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('grocery_items')
        .update({ completed: !completed })
        .eq('id', itemId);

      if (error) throw error;
    },
    onMutate: async ({ itemId, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['groceryItems', id] });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData(['groceryItems', id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['groceryItems', id], (old: GroceryItem[] | undefined) => {
        if (!old) return [];
        return old.map(item => 
          item.id === itemId ? { ...item, completed: !completed } : item
        );
      });

      // Return context with the previous value
      return { previousItems };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousItems) {
        queryClient.setQueryData(['groceryItems', id], context.previousItems);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: ['groceryItems', id] });
    },
  });

  const handleAddItem = async (name: string) => {
    if (!id) return;
    
    const { error } = await supabase
      .from('grocery_items')
      .insert([
        { name, list_id: id }
      ]);

    if (error) {
      console.error('Error adding item:', error);
      throw error;
    }

    // Refetch items after adding
    queryClient.invalidateQueries({ queryKey: ['groceryItems', id] });
  };

  const toggleItem = async (itemId: string, completed: boolean) => {
    await toggleMutation.mutate({ itemId, completed });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30 p-4">
      <div className="max-w-2xl mx-auto">
        <GroceryHeader shareCode={shareCode} />

        <div className="bg-white rounded-xl shadow-lg p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {listDetails?.name || translations.loading_lists}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMembers(true)}
                className="h-8 w-8"
              >
                <Users className="h-4 w-4" />
              </Button>
            </div>
            <AddItemDialog onAddItem={handleAddItem} isAdding={false} />
          </div>

          {isLoading ? (
            <div className="text-center py-4">{translations.loading_items}</div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <GroceryItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    completed={item.completed}
                    onToggle={toggleItem}
                  />
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  {translations.no_items}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ListMembersDialog
        listId={id || ""}
        open={showMembers}
        onOpenChange={setShowMembers}
      />
    </div>
  );
};

export default GroceryList;
