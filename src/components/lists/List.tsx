import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ListActionsDialog } from "./ListActionsDialog";
import { useState } from "react";

interface ListProps {
  list: {
    id: string;
    name: string;
    created_at: string;
    owner_id: string;
    share_code: string;
  };
}

export function List({ list }: ListProps) {
  const [showActionsDialog, setShowActionsDialog] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg mb-4 bg-white shadow-sm hover:bg-secondary/10 transition-colors">
      <div>
        <h3 className="font-medium">{list.name}</h3>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowActionsDialog(true)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <ListActionsDialog
        list={list}
        trigger={<MoreHorizontal className="h-4 w-4" />}
      />
    </div>
  );
}