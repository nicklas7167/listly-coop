import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { AddItemDialog } from "./AddItemDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface GroceryListHeaderProps {
  listName: string;
  isLoading: boolean;
  onShowMembers: () => void;
  onAddItem: (name: string) => Promise<void>;
}

export const GroceryListHeader = ({
  listName,
  isLoading,
  onShowMembers,
  onAddItem,
}: GroceryListHeaderProps) => {
  const { translations } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">
          {isLoading ? translations.loading_lists : listName}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowMembers}
          className="h-8 w-8"
        >
          <Users className="h-4 w-4" />
        </Button>
      </div>
      <AddItemDialog onAddItem={onAddItem} isAdding={false} />
    </div>
  );
};