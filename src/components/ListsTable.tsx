import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { ListTableRow } from "@/components/lists/ListTableRow";

interface ListsTableProps {
  lists: Array<{
    id: string;
    name: string;
    created_at: string;
    owner_id: string;
    share_code: string;
  }>;
  loading: boolean;
}

export function ListsTable({ lists, loading }: ListsTableProps) {
  const { translations } = useLanguage();

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">{translations.loading_lists}</div>;
  }

  if (lists.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{translations.no_lists}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{translations.name}</TableHead>
            <TableHead className="text-right">{translations.items}</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists.map((list) => (
            <ListTableRow 
              key={list.id} 
              list={list}
              itemCount={0}
              onRowClick={() => {}}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}