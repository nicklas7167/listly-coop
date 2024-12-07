import { Input } from "@/components/ui/input";
import { Translations } from "@/translations/types";

interface DeleteConfirmationInputProps {
  listName: string;
  value: string;
  onChange: (value: string) => void;
  translations: Translations;
}

export function DeleteConfirmationInput({ 
  listName, 
  value, 
  onChange,
  translations 
}: DeleteConfirmationInputProps) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-sm text-muted-foreground">
        {translations.type_list_name.replace("{listName}", listName)}
      </p>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={translations.type_list_name.replace("{listName}", listName)}
        className="mt-1"
      />
    </div>
  );
}