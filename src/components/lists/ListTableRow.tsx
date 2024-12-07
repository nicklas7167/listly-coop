import { TableCell, TableRow } from "@/components/ui/table";
import { ListActionsDialog } from "./ListActionsDialog";

interface ListTableRowProps {
  list: {
    id: string;
    name: string;
    share_code: string;
    owner_id: string;
  };
  itemCount: number;
  currentUserId?: string;
  onRowClick: (listId: string) => void;
}

export function ListTableRow({ list, itemCount, currentUserId, onRowClick }: ListTableRowProps) {
  return (
    <TableRow 
      key={list.id} 
      onClick={() => onRowClick(list.id)}
      className="cursor-pointer hover:bg-secondary/10 transition-colors"
    >
      <TableCell className="font-medium">{list.name}</TableCell>
      <TableCell className="text-right">{itemCount}</TableCell>
      <TableCell className="text-right">
        <ListActionsDialog list={list} currentUserId={currentUserId} />
      </TableCell>
    </TableRow>
  );
}