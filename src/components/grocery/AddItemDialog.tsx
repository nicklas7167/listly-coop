import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StoreSelect } from "./StoreSelect";
import { useParams } from "react-router-dom";

interface AddItemDialogProps {
  onAddItem: (name: string, store?: string, quantity?: string) => Promise<void>;
  isAdding: boolean;
}

export function AddItemDialog({ onAddItem, isAdding }: AddItemDialogProps) {
  const [newItem, setNewItem] = useState("");
  const [store, setStore] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { translations } = useLanguage();
  const { id: listId } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    await onAddItem(newItem.trim(), store.trim(), quantity);
    setNewItem("");
    setStore("");
    setQuantity("");
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full w-8 h-8 p-0">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-md p-0 gap-0 rounded-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-left">Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="item-name" className="text-lg font-semibold">
              Item Name
            </label>
            <Input
              id="item-name"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="e.g., Milk, Bread, Eggs"
              className="h-14 px-4 text-base rounded-xl border-2"
              autoFocus
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-lg font-semibold">
                Store
              </label>
              <StoreSelect
                listId={listId || ""}
                value={store}
                onChange={setStore}
              />
            </div>
            <div className="w-28 space-y-2">
              <label htmlFor="quantity" className="text-lg font-semibold">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="h-14 px-4 text-base rounded-xl border-2"
                min="0"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full h-14 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90" 
            disabled={!newItem.trim() || isAdding}
          >
            {isAdding ? translations.adding_item : translations.add_item}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}