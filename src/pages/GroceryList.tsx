import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { GroceryHeader } from "@/components/grocery/GroceryHeader";
import { AddItemDialog } from "@/components/grocery/AddItemDialog";
import { GroceryItem } from "@/components/grocery/GroceryItem";
import { AnimatePresence } from "framer-motion";
import { useGroceryMutations } from "@/hooks/useGroceryMutations";

interface GroceryItem {
  id: string;
  name: string;
  completed: boolean;
  list_id: string;
}

const GroceryList = () => {
  const { id } = useParams();
  const [shareCode, setShareCode] = useState<string>("");
  const { addItemMutation, toggleItemMutation, deleteItemMutation } = useGroceryMutations(id);

  // Fetch share code
  useEffect(() => {
    const fetchList = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("lists")
        .select("share_code")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching list:", error);
        return;
      }

      if (data) {
        setShareCode(data.share_code);
      }
    };

    fetchList();
  }, [id]);

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

  const handleAddItem = async (name: string) => {
    await addItemMutation.mutateAsync(name);
  };

  const toggleItem = async (itemId: string, currentStatus: boolean) => {
    await toggleItemMutation.mutateAsync({
      itemId,
      completed: !currentStatus,
    });
  };

  const handleDeleteItem = async (itemId: string) => {
    console.log('Handling delete for item:', itemId);
    return deleteItemMutation.mutateAsync(itemId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30 p-4">
      <div className="max-w-2xl mx-auto">
        <GroceryHeader shareCode={shareCode} />

        <div className="bg-white rounded-xl shadow-lg p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Grocery List</h1>
            <AddItemDialog 
              onAddItem={handleAddItem}
              isAdding={addItemMutation.isPending}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading items...</div>
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
                    onDelete={handleDeleteItem}
                  />
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No items in the list yet. Add some items to get started!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroceryList;