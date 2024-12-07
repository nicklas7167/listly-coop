import { Input } from "@/components/ui/input";

interface DeleteConfirmationInputProps {
  listName: string;
  value: string;
  onChange: (value: string) => void;
}

export function DeleteConfirmationInput({ listName, value, onChange }: DeleteConfirmationInputProps) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-sm text-muted-foreground">
        Please type <span className="font-semibold">{listName}</span> to confirm.
      </p>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type list name to confirm"
        className="mt-1"
      />
    </div>
  );
}