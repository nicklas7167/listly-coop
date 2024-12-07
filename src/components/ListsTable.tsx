import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListTableRow } from "./lists/ListTableRow";

interface List {
  id: string;
  name: string;
  share_code: string;
  owner_id: string;
}

interface ListsTableProps {
  lists: List[];
  loading: boolean;
}

export function ListsTable({ lists, loading }: ListsTableProps) {
  const navigate = useNavigate();

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch item counts for each list
  const { data: itemCounts } = useQuery({
    queryKey: ['itemCounts'],
    queryFn: async () => {
      console.log("Fetching item counts...");
      const counts: Record<string, number> = {};
      
      for (const list of lists) {
        const { count, error } = await supabase
          .from('grocery_items')
          .select('*', { count: 'exact', head: true })
          .eq('list_id', list.id);
          
        if (error) {
          console.error('Error fetching count for list:', list.id, error);
          counts[list.id] = 0;
        } else {
          counts[list.id] = count || 0;
        }
      }
      
      console.log("Item counts:", counts);
      return counts;
    },
    enabled: lists.length > 0,
  });

  const handleRowClick = (listId: string) => {
    navigate(`/list/${listId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading your lists...</div>;
  }

  if (!lists || lists.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">No Lists Yet</h3>
        <p className="text-gray-600 mb-4">
          Create your first list or join an existing one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists.map((list) => (
            <ListTableRow
              key={list.id}
              list={list}
              itemCount={itemCounts?.[list.id] || 0}
              currentUserId={currentUser?.id}
              onRowClick={handleRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}