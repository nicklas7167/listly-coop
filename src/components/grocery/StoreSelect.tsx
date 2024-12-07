import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  if (isAdding) {
    return (
      <div className="flex gap-2">
        <Input
          value={newStore}
          onChange={(e) => setNewStore(e.target.value)}
          placeholder={translations.enter_store_name}
          className="flex-1"
          autoFocus
        />
        <Button size="sm" onClick={handleAddStore}>
          <Plus className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsAdding(false)}
        >
          {translations.cancel}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={translations.select_store} />
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store} value={store}>
              {store}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => setIsAdding(true)}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}