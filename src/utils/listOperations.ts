import { supabase } from "@/integrations/supabase/client";

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("User not authenticated");
  }
  return user;
}

export async function createList(listName: string) {
  const user = await getCurrentUser();
  
  const { data, error } = await supabase
    .from("lists")
    .insert({
      name: listName,
      owner_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkListExists(listId: string) {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("id", listId)
    .single();

  if (error) throw new Error("List not found");
  return data;
}

export async function joinList(listId: string) {
  const user = await getCurrentUser();
  
  const { error } = await supabase
    .from("list_members")
    .insert({
      list_id: listId,
      user_id: user.id
    });

  if (error) {
    if (error.code === "23505") {
      // Unique violation - already a member
      return { alreadyMember: true };
    }
    throw error;
  }

  return { alreadyMember: false };
}