import { Trash } from "lucide-react";

interface GroceryItemProps {
  id: string;
  name: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function GroceryItem({ id, name, completed, onToggle, onDelete }: GroceryItemProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id, completed)}
        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <span className={`flex-1 ${completed ? "line-through text-gray-400" : ""}`}>
        {name}
      </span>
      <button
        onClick={() => onDelete(id)}
        className="text-gray-400 hover:text-red-500 transition-colors ml-auto"
        aria-label="Delete item"
      >
        <Trash className="h-4 w-4" />
      </button>
    </div>
  );
}