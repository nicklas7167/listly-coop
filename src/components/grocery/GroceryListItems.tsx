import { GroceryItem } from "./GroceryItem";
import { AnimatePresence } from "framer-motion";

interface GroceryListItemsProps {
  items: Array<{
    id: string;
    name: string;
    completed: boolean;
    creator_id: string;
  }>;
  onToggleItem: (itemId: string, completed: boolean) => Promise<void>;
}

export const GroceryListItems = ({ items, onToggleItem }: GroceryListItemsProps) => {
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <GroceryItem
            key={item.id}
            id={item.id}
            name={item.name}
            completed={item.completed}
            creatorId={item.creator_id}
            onToggle={onToggleItem}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};