import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface List {
  id: string;
  name: string;
  share_code: string;
}

interface ListsTableProps {
  lists: List[];
  loading: boolean;
}

export function ListsTable({ lists, loading }: ListsTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fetch item counts for each list
  const { data: itemCounts } = useQuery({
    queryKey: ['itemCounts'],
    queryFn: async () => {
      console.log("Fetching item counts...");
      const counts: Record<string, number> = {};
      
      // Fetch counts for each list individually
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

  const copyShareCode = (shareCode: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(shareCode);
    toast({
      title: "Share code copied!",
      description: "Share this code with others to collaborate on this list.",
    });
  };

  const handleRowClick = (listId: string) => {
    navigate(`/list/${listId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading your lists...</div>;
  }

  if (lists.length === 0) {
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
            <TableRow 
              key={list.id} 
              onClick={() => handleRowClick(list.id)}
              className="cursor-pointer hover:bg-secondary/10 transition-colors"
            >
              <TableCell className="font-medium">{list.name}</TableCell>
              <TableCell className="text-right">
                {itemCounts?.[list.id] || 0}
              </TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-48" 
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={(e) => copyShareCode(list.share_code, e)}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Copy Share Code</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate(`/list/${list.id}`)}
                      >
                        View List
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}