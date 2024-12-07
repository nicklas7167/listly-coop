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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translations.add_new_item}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="item-name" className="text-sm font-medium">
              Item Name
            </label>
            <Input
              id="item-name"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="e.g., Milk, Bread, Eggs"
              autoFocus
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">
                Store
              </label>
              <StoreSelect
                listId={listId || ""}
                value={store}
                onChange={setStore}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-24"
                min="0"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!newItem.trim() || isAdding}
          >
            {isAdding ? translations.adding_item : translations.add_item}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}