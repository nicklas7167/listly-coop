import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SwipeableListItem } from "@/components/SwipeableListItem";

interface GroceryItem {
  id: string;
  name: string;
  completed: boolean;
  list_id: string;
}

const GroceryList = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [newItem, setNewItem] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareCode, setShareCode] = useState<string>("");
  const queryClient = useQueryClient();

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

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!id) throw new Error('No list ID provided');
      const { data, error } = await supabase
        .from('grocery_items')
        .insert([{ name, list_id: id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryItems', id] });
      toast({
        title: "Item added",
        description: "The item has been added to your list.",
      });
    },
    onError: (error) => {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Toggle item mutation
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
      queryClient.invalidateQueries({ queryKey: ['groceryItems', id] });
    },
    onError: (error) => {
      console.error('Error toggling item:', error);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryItems', id] });
      toast({
        description: "Item removed",
        duration: 2000,
      });
    },
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    await addItemMutation.mutateAsync(newItem.trim());
    setNewItem("");
    setDialogOpen(false);
  };

  const toggleItem = async (itemId: string, currentStatus: boolean) => {
    await toggleItemMutation.mutateAsync({
      itemId,
      completed: !currentStatus,
    });
  };

  const copyShareCode = async () => {
    if (!shareCode) return;
    
    try {
      await navigator.clipboard.writeText(shareCode);
      toast({
        description: "Share code copied",
        duration: 2000,
      });
    } catch (err) {
      toast({
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={copyShareCode}
          >
            <Copy className="w-4 h-4" />
            Share Code
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Grocery List</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full w-8 h-8 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddItem} className="space-y-4 mt-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Enter item name..."
                    autoFocus
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!newItem.trim() || addItemMutation.isPending}
                  >
                    {addItemMutation.isPending ? "Adding..." : "Add Item"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading items...</div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <SwipeableListItem
                  key={item.id}
                  onDelete={() => deleteItemMutation.mutate(item.id)}
                >
                  <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(item.id, item.completed)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span
                      className={`flex-1 ${
                        item.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </SwipeableListItem>
              ))}
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
};

export default GroceryList;
