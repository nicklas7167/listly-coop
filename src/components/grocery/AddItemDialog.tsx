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

    await onAddItem(newItem.trim(), store.trim(), quantity.trim());
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
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={translations.enter_item_name}
            autoFocus
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <StoreSelect
                listId={listId || ""}
                value={store}
                onChange={setStore}
              />
            </div>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={translations.quantity}
              className="w-24"
            />
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