import { useLanguage } from "@/contexts/LanguageContext";
import { List } from "@/components/lists/List";

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
    return <div>{translations.loading_lists}</div>;
  }

  return (
    <div>
      {lists.length === 0 ? (
        <p>{translations.no_lists}</p>
      ) : (
        lists.map((list) => <List key={list.id} list={list} />)
      )}
    </div>
  );
}