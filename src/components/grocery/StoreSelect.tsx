import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

interface StoreSelectProps {
  listId: string;
  value: string;
  onChange: (value: string) => void;
}

export function StoreSelect({ listId, value, onChange }: StoreSelectProps) {
  const [newStore, setNewStore] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();
  const { translations } = useLanguage();

  const { data: stores = [] } = useQuery({
    queryKey: ['stores', listId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('list_stores')
        .select('name')
        .eq('list_id', listId)
        .order('name');

      if (error) throw error;
      return data.map(store => store.name);
    },
  });

  const handleAddStore = async () => {
    if (!newStore.trim()) return;

    try {
      const { error } = await supabase
        .from('list_stores')
        .insert({ list_id: listId, name: newStore.trim() });

      if (error) throw error;

      // Update the stores list
      queryClient.invalidateQueries({ queryKey: ['stores', listId] });
      onChange(newStore.trim());
      setNewStore("");
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding store:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal"
        >
          {value || translations.select_store}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translations.stores}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {stores.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {stores.map((store) => (
                <Button
                  key={store}
                  variant={value === store ? "default" : "outline"}
                  className="w-full"
                  onClick={() => {
                    onChange(store);
                  }}
                >
                  {store}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              {translations.no_stores}
            </p>
          )}
          
          {isAdding ? (
            <div className="flex gap-2">
              <Input
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                placeholder={translations.enter_store_name}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleAddStore}>
                <Plus className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAdding(false)}
              >
                {translations.cancel}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              {translations.add_store}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}