import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Copy, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GroceryItem {
  id: string;
  name: string;
  completed: boolean;
}

const GroceryList = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const item: GroceryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.trim(),
      completed: false,
    };

    setItems([...items, item]);
    setNewItem("");
    setDialogOpen(false);
  };

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const copyShareCode = () => {
    navigator.clipboard.writeText(id!);
    toast({
      title: "Share code copied!",
      description: "Share this code with others to collaborate on this list.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
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
                  <Button type="submit" className="w-full" disabled={!newItem.trim()}>
                    Add Item
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors animate-fade-in"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryList;