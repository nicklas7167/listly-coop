import { SwipeableListItem } from "@/components/SwipeableListItem";

interface GroceryItemProps {
  id: string;
  name: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function GroceryItem({ id, name, completed, onToggle, onDelete }: GroceryItemProps) {
  return (
    <SwipeableListItem onDelete={() => onDelete(id)}>
      <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id, completed)}
          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className={`flex-1 ${completed ? "line-through text-gray-400" : ""}`}>
          {name}
        </span>
      </div>
    </SwipeableListItem>
  );
}