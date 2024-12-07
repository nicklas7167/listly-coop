import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
            <TableHead>Share Code</TableHead>
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
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-xs sm:text-sm"
                  onClick={(e) => copyShareCode(list.share_code, e)}
                >
                  <span className="font-mono">{list.share_code}</span>
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/list/${list.id}`);
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}