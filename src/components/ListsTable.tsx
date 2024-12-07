import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchLists } from "@/utils/listOperations";
import { List } from "@/components/List";

export function ListsTable() {
  const { translations } = useLanguage();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLists = async () => {
      try {
        const data = await fetchLists();
        setLists(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getLists();
  }, []);

  if (loading) {
    return <div>{translations.loading_lists}</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          {translations.error_loading}
        </p>
      </div>
    );
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
